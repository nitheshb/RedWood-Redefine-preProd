import DocViewer, { DocViewerRenderers } from '@cyntler/react-doc-viewer'

const ViewDocxFile = ({ docUrl }) => {
  const docs = [
    {
      uri: 'https://docs.google.com/document/d/1Qz3Om6cdea10q2RjW2KMy7tzJqeOZv4wjguElBsQFr4/edit',
    }, // Remote file
  ]
  return (
    <div>
      <h1>Document Viewer</h1>

      <DocViewer documents={docs} pluginRenderers={DocViewerRenderers} />
    </div>
  )
}

export default ViewDocxFile
