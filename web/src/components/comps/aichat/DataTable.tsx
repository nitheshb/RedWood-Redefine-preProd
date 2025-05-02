const DataTable = ({ response }) => {
  if (!response?.length) return
  const headers = Object.keys(response[0])

  return (
    <div>
      <h2>Data Table</h2>
      <table
        style={{
          width: '100%',
          border: '1px solid #ddd',
          borderCollapse: 'collapse',
        }}
      >
        <thead>
          <tr>
            {headers?.map((header) => (
              <th
                key={header}
                style={{
                  padding: '8px',
                  textAlign: 'left',
                  border: '1px solid #ddd',
                }}
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {response?.map((row, index) => (
            <tr key={index}>
              {headers?.map((header) => (
                <td
                  key={header}
                  style={{ padding: '8px', border: '1px solid #ddd' }}
                >
                  {typeof row[header] !== 'object' ? row[header] : 'InValid'}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default DataTable
