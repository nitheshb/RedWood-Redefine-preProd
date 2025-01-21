export const downloadImage = (imageUrl, filename) => {

  console.error('Error downloading image:', imageUrl)
  fetch(imageUrl)
    .then((response) => response.blob())
    .then((blob) => {
      // Create a temporary anchor element
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url

      // Extract the filename from the URL
      // const filename = imageUrl.substring(imageUrl.lastIndexOf('/') + 1)

      // Set the download attribute and filename
      link.setAttribute('download', filename)
      document.body.appendChild(link)
      console.log('fetcher url ', filename)
      // Simulate a click on the anchor element to start the download
      link.click()

      // Clean up the temporary anchor element
      link.parentNode.removeChild(link)

      // Set the downloaded image URL to display on the page
      setImageUrl(url)
    })
    .catch((error) => {
      console.error('Error downloading image:', error)
    })
}