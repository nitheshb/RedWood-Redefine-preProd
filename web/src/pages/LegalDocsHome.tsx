import { useState, useEffect } from 'react';
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
import { SearchIcon } from '@heroicons/react/outline';
import FileUpload from 'src/components/A_TaskMan/FileUpload';
import { addDoc, collection, serverTimestamp, query, where, getDocs, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { db, storage } from 'src/context/firebaseConfig';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

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
  const [viewType, setViewType] = useState('list');
  const [folderFiles, setFolderFiles] = useState({});
  const [isSaving, setIsSaving] = useState(false);

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

    switch (viewType) {
      case 'list':
        return (
          <div className="space-y-2">
            {filteredItems.map((project, index) => (
              <div
                key={index}
                onClick={() => { setSelectedProject(project); setCurrentFolder('blocks'); }}
                className="p-2 border rounded-lg cursor-pointer hover:bg-gray-100 flex items-center gap-3"
              >
              <img className="w-8 h-8" alt="" src={'https://static.hsappstatic.net/ui-images/static-2.758/optimized/documents.svg'}></img>

                <h3 className="font-semibold">{project.projectName}</h3>
              </div>
            ))}
          </div>
        );
      case 'small':
        return (
          <div className="grid grid-cols-4 gap-4">
            {filteredItems.map((project, index) => (
              <div
                key={index}
                onClick={() => { setSelectedProject(project); setCurrentFolder('blocks'); }}
                className="p-4 border rounded-lg cursor-pointer hover:bg-gray-100 flex flex-col items-center gap-2"
              >
                <img className="w-8 h-8" alt="" src={'https://static.hsappstatic.net/ui-images/static-2.758/optimized/documents.svg'}></img>
                <h3 className="font-semibold text-sm text-center">{project.projectName}</h3>
              </div>
            ))}
          </div>
        );
      case 'large':
        return (
          <div className="grid grid-cols-2 gap-4">
            {filteredItems.map((project, index) => (
              <div
                key={index}
                onClick={() => { setSelectedProject(project); setCurrentFolder('blocks'); }}
                className="p-6 border rounded-lg cursor-pointer hover:bg-gray-100 flex flex-col items-center gap-3"
              >

                <img className="w-8 h-8" alt="" src={'https://static.hsappstatic.net/ui-images/static-2.758/optimized/documents.svg'}></img>
                <h3 className="font-semibold text-lg text-center">{project.projectName}</h3>
              </div>
            ))}
          </div>
        );
      case 'details':
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
                <div className="text-sm text-gray-500">
                  <p>Created: {project.createdAt}</p>
                  <p>Updated: {project.updatedAt}</p>
                </div>
              </div>
            ))}
          </div>
        );
      default:
        return null;
    }
  };

  // Render blocks
  const renderBlocks = () => {
    const filteredItems = filterItems(blocks, searchTerm);

    switch (viewType) {
      case 'list':
        return (
          <div className="space-y-2">
            {filteredItems.map((block, index) => (
              <div
                key={index}
                onClick={() => { setSelectedBlock(block); setCurrentFolder('units'); }}
                className="p-2 border rounded-lg cursor-pointer hover:bg-gray-100 flex items-center gap-3"
              >
                <span className="text-2xl">📦</span>
                <h3 className="font-semibold">{block.blockName}</h3>
              </div>
            ))}
          </div>
        );
      case 'small':
        return (
          <div className="grid grid-cols-4 gap-4">
            {filteredItems.map((block, index) => (
              <div
                key={index}
                onClick={() => { setSelectedBlock(block); setCurrentFolder('units'); }}
                className="p-4 border rounded-lg cursor-pointer hover:bg-gray-100 flex flex-col items-center gap-2"
              >
                <span className="text-2xl">📦</span>
                <h3 className="font-semibold text-sm text-center">{block.blockName}</h3>
              </div>
            ))}
          </div>
        );
      case 'large':
        return (
          <div className="grid grid-cols-2 gap-4">
            {filteredItems.map((block, index) => (
              <div
                key={index}
                onClick={() => { setSelectedBlock(block); setCurrentFolder('units'); }}
                className="p-6 border rounded-lg cursor-pointer hover:bg-gray-100 flex flex-col items-center gap-3"
              >
                <span className="text-4xl">📦</span>
                <h3 className="font-semibold text-lg text-center">{block.blockName}</h3>
              </div>
            ))}
          </div>
        );
      case 'details':
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
                <div className="text-sm text-gray-500">
                  <p>Created: {block.createdAt}</p>
                  <p>Updated: {block.updatedAt}</p>
                </div>
              </div>
            ))}
          </div>
        );
      default:
        return null;
    }
  };

  // Render units
  const renderUnits = () => {
    const filteredItems = filterItems(units, searchTerm);

    switch (viewType) {
      case 'list':
        return (
          <div className="space-y-2">
            {filteredItems.map((unit, index) => (
              <div
                key={index}
                onClick={() => { setSelectedUnit(unit); setCurrentFolder('documents'); }}
                className="p-2 border rounded-lg cursor-pointer hover:bg-gray-100 flex items-center gap-3"
              >
                <span className="text-2xl">📁</span>
                <h3 className="font-semibold">{unit.unit_no}</h3>
              </div>
            ))}
          </div>
        );
      case 'small':
        return (
          <div className="grid grid-cols-4 gap-4">
            {filteredItems.map((unit, index) => (
              <div
                key={index}
                onClick={() => { setSelectedUnit(unit); setCurrentFolder('documents'); }}
                className="p-4 border rounded-lg cursor-pointer hover:bg-gray-100 flex flex-col items-center gap-2"
              >
                <span className="text-2xl">📁</span>
                <h3 className="font-semibold text-sm text-center">{unit.unit_no}</h3>
              </div>
            ))}
          </div>
        );
      case 'large':
        return (
          <div className="grid grid-cols-2 gap-4">
            {filteredItems.map((unit, index) => (
              <div
                key={index}
                onClick={() => { setSelectedUnit(unit); setCurrentFolder('documents'); }}
                className="p-6 border rounded-lg cursor-pointer hover:bg-gray-100 flex flex-col items-center gap-3"
              >
                <span className="text-4xl">📁</span>
                <h3 className="font-semibold text-lg text-center">{unit.unit_no}</h3>
              </div>
            ))}
          </div>
        );
      case 'details':
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
                <div className="text-sm text-gray-500">
                  <p>Created: {unit.createdAt}</p>
                  <p>Updated: {unit.updatedAt}</p>
                </div>
              </div>
            ))}
          </div>
        );
      default:
        return null;
    }
  };

  // Render file upload section
  const renderFileUploadSection = (folderId) => {
    if (!folderId) {
      return <div>No folder selected</div>;
    }

    const files = folderFiles[folderId] || [];

    return (
      <div className="mt-4">
        <FileUpload
          files={files}
          setFiles={handleFileUpload}
          removeFile={(fileName) => removeFile(folderId, fileName)}
        />
        <div className="mt-4">
          {files.map((file, index) => (
            <div key={index} className="flex items-center justify-between p-2 border rounded-lg mb-2">
              <span>{file.name}</span>
              <div className="flex gap-2">
                <button
                  onClick={() => window.open(file.url, '_blank')}
                  className="text-blue-500 hover:text-blue-700"
                >
                  View
                </button>
                <button
                  onClick={() => handleDownload(file.url, file.name)}
                  className="text-green-500 hover:text-green-700"
                >
                  Download
                </button>
                <button
                  onClick={() => removeFile(folderId, file.name)}
                  className="text-red-500 hover:text-red-700"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
        <button
          onClick={() => saveFilesToDatabase(folderId)}
          disabled={isSaving}
          className={`mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-700 ${
            isSaving ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          {isSaving ? 'Saving...' : 'Save Files'}
        </button>
      </div>
    );
  };

  // Handle back navigation
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

  // Handle filter project change
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

  // Handle search change
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // Handle view change
  const handleViewChange = (e) => {
    setViewType(e.target.value);
  };

  // Filter items based on search term
  const filterItems = (items, searchTerm) => {
    return items.filter((item) =>
      item.projectName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.blockName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.unit_no?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  // Handle file download
  const handleDownload = (fileUrl, fileName) => {
    const link = document.createElement('a');
    link.href = fileUrl;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <section className="mt-2 py-6 mb-8 mx-1 leading-7 text-gray-900 bg-white rounded-lg">
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
          {currentFolder !== 'projects' && (
            <button
              onClick={handleBack}
              className="mb-4 px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
            >
              Back
            </button>
          )}
          <div className="mb-4 flex justify-between">
            <div className="relative w-1/2">
              <input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={handleSearchChange}
                className="px-4 py-2 border rounded-lg w-full pl-10"
              />
              <SearchIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>
            <select
              value={viewType}
              onChange={handleViewChange}
              className="px-4 py-2 border rounded-lg"
            >
              <option value="small">Small Icons</option>
              <option value="list">List View</option>
              <option value="large">Large Icons</option>
              <option value="details">Details</option>
            </select>
          </div>
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
              <h2 className="text-lg font-bold mb-4">Blocks</h2>
              {renderBlocks()}
            </div>
          )}
          {currentFolder === 'units' && (
            <div>
              <h2 className="text-lg font-bold mb-4">Units</h2>
              {renderUnits()}
            </div>
          )}
          {currentFolder === 'documents' && selectedUnit && (
            <div>
              <h2 className="text-lg font-bold mb-4">Documents</h2>
              {renderFileUploadSection(selectedUnit.uid)}
            </div>
          )}
        </div>
      </div>
    </section>

  
  );
};

export default LegalDocsHome;