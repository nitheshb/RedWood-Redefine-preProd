// import { useState, useEffect } from 'react';
import { Link } from '@redwoodjs/router';
import {
  getAllProjects,
  getBlocksByPhase,
  getPhasesByProject,
  getUnits,
} from 'src/context/dbQueryFirebase';
import { useAuth } from 'src/context/firebase-auth-context';
import 'flowbite';
import 'src/styles/myStyles.css';
import { ArrowNarrowLeftIcon } from '@heroicons/react/outline';
import FileUpload from 'src/components/A_TaskMan/FileUpload';
import { addDoc, collection, serverTimestamp, query, where, getDocs, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { db, storage } from 'src/context/firebaseConfig';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useState, useEffect } from 'react';
import UnitDocsWidget from 'src/components/LegalModule/UnitDocsWidget';

const LegalDocsHome = ({ project }) => {
  const { user } = useAuth();
  const { orgId } = user;

  const [projects, setProjects] = useState([]);
  const [phases, setPhases] = useState([]);
  const [blocks, setBlocks] = useState([]);
  const [units, setUnits] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [selectedBlock, setSelectedBlock] = useState(null);
  const [selectedUnit, setSelectedUnit] = useState(null);
  const [currentFolder, setCurrentFolder] = useState('projects');
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [selectedFilterProject, setSelectedFilterProject] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [viewType, setViewType] = useState('small');
  const [folderFiles, setFolderFiles] = useState({});
  const [isSaving, setIsSaving] = useState(false);
  const documentTypes = [
    {
      id: 1235,
      name: 'Agreement',
      type: 'agree',
      uploadedCount: selectedUnit?.agree_doc_count || 0
    },
    {
      id: 1236,
      name: 'Register Doc',
      type: 'reg',
       uploadedCount: selectedUnit?.reg_doc_count  || 0

    },
    {
      id: 1237,
      name: 'Construction Gallery',
      type: 'constructGallery',
      uploadedCount: selectedUnit?.constructGallery_doc_count || 0
    },
    {
      id: 1238,
      name: 'EC',
      type: 'ec',
      uploadedCount: selectedUnit?.ec_doc_count || 0
    },
    {
      id: 1239,
      name: 'Others',
      type: 'others',
      uploadedCount: selectedUnit?.others_doc_count || 0
    },
  ];
  // Fetch projects
  useEffect(() => {
    let isMounted = true;

    const fetchProjects = async () => {
      const unsubscribe = getAllProjects(
        orgId,
        (querySnapshot) => {
          if (isMounted) {
            const projectsData = querySnapshot.docs.map((docSnapshot) => docSnapshot.data());
            setProjects(projectsData);
            setFilteredProjects(projectsData);
          }
        },
        (error) => {
          console.error('Error fetching projects:', error);
        }
      );
      return unsubscribe;
    };

    fetchProjects();

    return () => {
      isMounted = false;
    };
  }, [orgId]);

  // Fetch phases for selected project
  useEffect(() => {
    let isMounted = true;

    if (selectedProject) {
      const fetchPhases = async () => {
        const unsubscribe = getPhasesByProject(
          orgId,
          selectedProject.uid,
          (querySnapshot) => {
            if (isMounted) {
              const phasesData = querySnapshot.docs.map((docSnapshot) => docSnapshot.data());
              setPhases(phasesData);
            }
          },
          (error) => {
            console.error('Error fetching phases:', error);
          }
        );
        return unsubscribe;
      };
      fetchPhases();
    }

    return () => {
      isMounted = false;
    };
  }, [selectedProject, orgId]);

  useEffect(() => {
    let isMounted = true;

    if (selectedProject && phases.length > 0) {
      const fetchBlocks = async () => {
        const unsubscribe = getBlocksByPhase(
          orgId,
          { projectId: selectedProject.uid, phaseId: phases[0].uid },
          (querySnapshot) => {
            if (isMounted) {
              const blocksData = querySnapshot.docs.map((docSnapshot) => docSnapshot.data());
              setBlocks(blocksData);
            }
          },
          (error) => {
            console.error('Error fetching blocks:', error);
          }
        );
        return unsubscribe;
      };
      fetchBlocks();
    }

    return () => {
      isMounted = false;
    };
  }, [selectedProject, phases, orgId]);

  // Fetch units for selected block
  useEffect(() => {
    let isMounted = true;

    if (selectedBlock) {
      const fetchUnits = async () => {
        const unsubscribe = getUnits(
          orgId,
          (querySnapshot) => {
            if (isMounted) {
              const unitsData = querySnapshot.docs.map((docSnapshot) => docSnapshot.data());
              setUnits(unitsData);
            }
          },
          { pId: selectedProject.uid, blockId: selectedBlock.uid, type: 'today' },
          (error) => {
            console.error('Error fetching units:', error);
          }
        );
        return unsubscribe;
      };
      fetchUnits();
    }

    return () => {
      isMounted = false;
    };
  }, [selectedBlock, selectedProject, orgId]);

  // Fetch files for selected unit
  useEffect(() => {
    if (selectedUnit) {
      const fetchFiles = async () => {
        const files = await fetchFilesForFolder(orgId, selectedUnit.uid);
        setFolderFiles((prev) => ({
          ...prev,
          [selectedUnit.uid]: files,
        }));
      };
      fetchFiles();
    }
  }, [selectedUnit, orgId]);

  // Upload file to Firebase Storage
  const uploadFileToStorage = async (file) => {
    const storageRef = ref(storage, `files/${file.name}`);
    await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(storageRef);
    return { name: file.name, url: downloadURL, size: file.size, type: file.type };
  };

  // Save file metadata to Firestore
  const saveFilesToFirestore = async (orgId, folderId, files, userId) => {
    if (!folderId) {
      console.error('Folder ID is undefined');
      return;
    }

    try {
      const filesCollectionRef = collection(db, `${orgId}_legal_documents`);
      const payload = {
        folderId,
        files,
        orgId,
        userId,
        createdAt: serverTimestamp(),
      };
      const docRef = await addDoc(filesCollectionRef, payload);
      console.log('Files saved successfully with ID:', docRef.id);
      return docRef.id;
    } catch (error) {
      console.error('Error saving files to Firestore:', error);
      throw error;
    }
  };

  const fetchFilesForFolder = async (orgId, folderId) => {
    const filesQuery = query(
      collection(db, `${orgId}_legal_documents`),
      where('folderId', '==', folderId)
    );
    const querySnapshot = await getDocs(filesQuery);
    const files = querySnapshot.docs.map((doc) => doc.data());
    return files;
  };

  const deleteFileFromFirestore = async (orgId, docId) => {
    const docRef = doc(db, `${orgId}_legal_documents`, docId);
    await deleteDoc(docRef);
    console.log('File deleted successfully:', docId);
  };

  const updateFileInFirestore = async (orgId, docId, updatedFile) => {
    const docRef = doc(db, `${orgId}_legal_documents`, docId);
    await updateDoc(docRef, updatedFile);
    console.log('File updated successfully:', docId);
  };

  const saveFilesToDatabase = async (folderId) => {
    if (isSaving || !folderId) return;

    setIsSaving(true);

    try {
      const files = folderFiles[folderId] || [];
      const uniqueFiles = files.filter(
        (file, index, self) =>
          index === self.findIndex((f) => f.name === file.name && f.url === file.url)
      );

      await saveFilesToFirestore(orgId, folderId, uniqueFiles, user.uid);
      console.log('Files saved successfully:', uniqueFiles);
    } catch (error) {
      console.error('Error saving files:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleFileUpload = async (files) => {
    const uploadedFiles = await Promise.all(
      files.map(async (file) => {
        const fileMetadata = await uploadFileToStorage(file);
        return fileMetadata;
      })
    );

    setFolderFiles((prev) => ({
      ...prev,
      [selectedUnit.uid]: [...(prev[selectedUnit.uid] || []), ...uploadedFiles],
    }));
  };

  const removeFile = async (folderId, fileName) => {
    const fileToDelete = folderFiles[folderId].find((file) => file.name === fileName);
    if (fileToDelete && fileToDelete.id) {
      await deleteFileFromFirestore(orgId, fileToDelete.id);
    }
    setFolderFiles((prev) => ({
      ...prev,
      [folderId]: prev[folderId].filter((file) => file.name !== fileName),
    }));
  };

  const renderProjects = () => {
    const filteredItems = filterItems(filteredProjects, searchTerm);
    return (
      <div className="space-y-2">
        {filteredItems.map((project, index) => (
          <div
            key={index}
            onClick={() => { setSelectedProject(project); setCurrentFolder('blocks'); }}
            className="p-2 border rounded-lg cursor-pointer hover:bg-gray-100 flex items-center justify-between gap-3"
          >
            <div className="flex items-center gap-3">
              <img className="w-8 h-8" alt="" src={'https://static.hsappstatic.net/ui-images/static-2.758/optimized/documents.svg'}></img>
              <h3 className="font-semibold">{project.projectName}</h3>
            </div>


            <div className="text-sm flex text-gray-500 justify-center items-center">
  <span className="text-[12px] min-w-[4rem] text-left inline-block font-outfit text-[#606062]">
    {project?.all_doc_c || 0} Documents
  </span>
  <div className="w-[2px] mx-2 h-[8px] border-0 border-r flex items-center justify-center"></div>
  <span className="text-[12px] min-w-[3rem] inline-block text-left font-outfit text-[#606062]">
    {project?.public_doc_c || 0} Public
  </span>
  <div className="w-[2px] mx-2 h-[8px] border-0 border-r flex items-center justify-center"></div>
  <span className="text-[12px] min-w-[3rem] inline-block text-left font-outfit text-[#606062]">
    {project?.internal_doc_c || 0} Internal
  </span>
  <div className="w-[2px] mx-2 h-[8px] border-0 border-r flex items-center justify-center"></div>
  <span className="text-[12px] min-w-[3rem] inline-block text-right font-outfit text-[#606062]">
    {project?.customer_doc_c || 0} Customer
  </span>
</div>


          </div>
        ))}
      </div>
    );

  };

  const renderBlocks = () => {
    const filteredItems = filterItems(blocks, searchTerm);
    return (
      <div className="space-y-2">
        {filteredItems.map((block, index) => (
          <div
            key={index}
            onClick={() => { setSelectedBlock(block); setCurrentFolder('units'); }}
            className="p-2 border rounded-lg cursor-pointer hover:bg-gray-100 flex items-center justify-between gap-3"
          >
            <div className="flex items-center gap-3">
              <span className="text-2xl">📦</span>
              <h3 className="font-semibold">{block.blockName}</h3>
            </div>
            <div className="text-sm flex items-center   text-gray-500">
            <span className="text-[12px] font-outfit text-[#606062]">
        {block?.all_doc_c || 0} Documents
      </span>
      <div className="w-[2px] mx-2 h-[8px] border-0 border-r flex items-center justify-center"></div>

      <span className="text-[12px] ml-2 font-outfit text-[#606062]">
        {block?.public_doc_c || 0} Public
      </span>
      <div className="w-[2px] mx-2 h-[8px] border-0 border-r flex items-center justify-center"></div>


      <span className="text-[12px] ml-2 font-outfit text-[#606062]">
        {block?.internal_doc_c || 0} Internal
      </span>
      <div className="w-[2px] mx-2 h-[8px] border-0 border-r flex items-center justify-center"></div>


      <span className="text-[12px] ml-2 font-outfit text-[#606062]">
        {block?.customer_doc_c || 0} Customer
      </span>
      </div>
          </div>
        ))}
      </div>
    );
  };

  const renderUnits = () => {
    const filteredItems = filterItems(units, searchTerm);
    return (
      <div className="space-y-2">
        {filteredItems.map((unit, index) => (
          <div
            key={index}
            onClick={() => { setSelectedUnit(unit); setCurrentFolder('documents'); }}
            className="p-2 border rounded-lg cursor-pointer hover:bg-gray-100 flex items-center justify-between gap-3"
          >
            <div className="flex items-center gap-3">
              <span className="text-2xl">📁</span>
              <h3 className="font-semibold">{unit.unit_no}</h3>
            </div>
            <div className="text-sm flex items-center text-gray-500">
            <span className="text-[12px] font-outfit text-[#606062]">
        {unit?.all_doc_c || 0} Documents
      </span>
      <div className="w-[2px] mx-2 h-[8px] border-0 border-r flex items-center justify-center"></div>

      <span className="text-[12px] ml-2 font-outfit text-[#606062]">
        {unit?.public_doc_c || 0} Public
      </span>
      <div className="w-[2px] mx-2 h-[8px] border-0 border-r flex items-center justify-center"></div>

      <span className="text-[12px] ml-2 font-outfit text-[#606062]">
        {unit?.internal_doc_c || 0} Internal
      </span>
      <div className="w-[2px] mx-2 h-[8px] border-0 border-r flex items-center justify-center"></div>

      <span className="text-[12px] ml-2 font-outfit text-[#606062]">
        {unit?.customer_doc_c || 0} Customer
      </span>
      </div>
          </div>
        ))}
      </div>
    );
  };



  const handleBack = () => {
    if (currentFolder === 'blocks') {
      setCurrentFolder('projects');
      setSelectedProject(null);
    } else if (currentFolder === 'units') {
      setCurrentFolder('blocks');
      setSelectedBlock(null);
    } else if (currentFolder === 'documents') {
      setCurrentFolder('units');
      setSelectedUnit(null);
    }
  };

  const handleFilterProjectChange = (e) => {
    const selectedProjectName = e.target.value;
    setSelectedFilterProject(selectedProjectName);

    if (selectedProjectName === '') {
      setFilteredProjects(projects);
    } else {
      const filtered = projects.filter((project) => project.projectName === selectedProjectName);
      setFilteredProjects(filtered);
    }
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleViewChange = (e) => {
    setViewType(e.target.value);
  };

  const filterItems = (items, searchTerm) => {
    return items.filter((item) =>
      item.projectName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.blockName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.unit_no?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  const handleDownload = (fileUrl, fileName) => {
    const link = document.createElement('a');
    link.href = fileUrl;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <section className="mt-1 py-6 mb-8 mx-1 leading-7 text-gray-900 bg-white rounded-lg">
      <div className="box-border px-4 mx-auto border-solid sm:px-6 md:px-6 lg:px-8 max-w-full">
        <div className="flex flex-col leading-7 text-gray-900 border-0 border-gray-200 border-b-[1px]  py-[20px] pb-[10px]  border-[cbd6e2] ">
          <div className="flex  flex-shrink-0 px-0 pl-0 mb-1">
            <section className="flex flex-row ">
              <img className="w-8 h-8" alt="" src={'https://static.hsappstatic.net/ui-images/static-2.758/optimized/documents.svg'}></img>
              <span className="relative z-10 ml-2 flex items-center w-auto text-lg font-bold leading-none pl-0 text-[#33475b]">
                Legal Documents
              </span>
            </section>
          </div>
        </div>
        <div className="mt-4">


          {currentFolder === 'projects' && (
            <div>
              <h2 className="text-lg font-bold mb-4">Projects</h2>
              <div className="mb-4">
                <label htmlFor="projectFilter" className="mr-2">Filter by Project:</label>
                <select
                  id="projectFilter"
                  value={selectedFilterProject}
                  onChange={handleFilterProjectChange}
                  className="px-4 py-2 border rounded-lg"
                >
                  <option value="">All Projects</option>
                  {projects.map((project, index) => (
                    <option key={index} value={project.projectName}>
                      {project.projectName}
                    </option>
                  ))}
                </select>
              </div>
              {renderProjects()}
            </div>
          )}
          {currentFolder === 'blocks' && (
            <div>
              <section className="flex items-center justify-between  mb-4">
                <div className='flex flex-row items-center'>
                <h2 className="text-lg font-bold">Blocks</h2>
                <span className=" text-gray-800 rounded-lg px-2 pt-[2px] text-sm">
                  {selectedProject?.projectName}
                </span>
                </div>
                <button
              onClick={handleBack}
              className="mb-4 px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
            >
                            <ArrowNarrowLeftIcon className="w-4 h-4" />
            </button>
              </section>
              {renderBlocks()}
            </div>
          )}
          {currentFolder === 'units' && (
            <div>
               <section className="flex items-center justify-between  mb-4">
               <div className='flex flex-row items-center'>
                <h2 className="text-lg font-bold">Units:</h2>
                <span className=" text-gray-800 rounded-lg px-2 pt-[2px] text-sm">
                  {selectedProject?.projectName}{'-'}{selectedBlock?.blockName}
                </span>
                </div>
                <button
              onClick={handleBack}
              className="mb-4 px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
            >
              <ArrowNarrowLeftIcon className="w-4 h-4" />
            </button>
              </section>
              {renderUnits()}
            </div>
          )}
          {currentFolder === 'documents' && selectedUnit && (
            <div>
               <section className="flex items-center justify-between  mb-4">
               <div className='flex flex-row items-center'>
                <h2 className="text-lg font-bold">Unit Documents:</h2>
                <span className=" text-gray-800 rounded-lg px-2 pt-[2px] text-sm">
                  <span className='border-b'>{selectedProject?.projectName}</span>{'-'}{selectedBlock?.blockName}{'-'}{selectedUnit?.unit_no}
                </span>
                </div>
                <button
              onClick={handleBack}
              className="mb-4 px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
            >
              <ArrowNarrowLeftIcon className="w-4 h-4" />
            </button>
              </section>
              <div className="w-full max-w-3xl px-4 flex flex-col">


      <section className="w-full max-w-3xl mx-auto  mt-2 rounded-2xl">


    {documentTypes.length === 0 ? (
      <div className="w-full text-center py-5">No documents</div>
    ) : (
      documentTypes.map((doc, i) => (
        <section key={i} className="px-4">
          <UnitDocsWidget
            data={doc}
            id={selectedUnit?.id}
            unitDetails={selectedUnit}
            fileName={doc?.name}
            date={doc?.time}
            uploadedCount={doc.uploadedCount}

          />
        </section>
      ))
    )}
  </section>
  </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default LegalDocsHome;