
import { useState, useCallback } from "react"
import { useDropzone } from "react-dropzone"
import { YoutubeHeader } from "@/components/youtube-header"
import { SidebarProvider } from "@/components/ui/sidebar"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Upload, ImageIcon } from "lucide-react"

export default function PublishPage() {
  const [videoFile, setVideoFile] = useState(null)
  const [thumbnail, setThumbnail] = useState(null)
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")

  const onVideoDrop = useCallback((acceptedFiles) => {
    setVideoFile(acceptedFiles[0])
  }, [])

  const onThumbnailDrop = useCallback((acceptedFiles) => {
    setThumbnail(URL.createObjectURL(acceptedFiles[0]))
  }, [])

  const { getRootProps: getVideoRootProps, getInputProps: getVideoInputProps } = useDropzone({
    onDrop: onVideoDrop,
    accept: "video/*",
    multiple: false,
  })

  const { getRootProps: getThumbnailRootProps, getInputProps: getThumbnailInputProps } = useDropzone({
    onDrop: onThumbnailDrop,
    accept: "image/*",
    multiple: false,
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    // Handle form submission (e.g., send data to server)
    console.log({ videoFile, thumbnail, title, description })
  }

  return (
        <main className="container mx-auto px-4 py-8">
          <h1 className="text-2xl font-bold mb-6">Publish Video</h1>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <h2 className="text-lg font-semibold mb-2">Upload Video</h2>
              <div
                {...getVideoRootProps()}
                className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-gray-400 transition-colors"
              >
                <input {...getVideoInputProps()} />
                {videoFile ? (
                  <p>{videoFile.name}</p>
                ) : (
                  <div>
                    <Upload className="mx-auto h-12 w-12 text-gray-400" />
                    <p className="mt-2">Drag and drop a video file here, or click to select a file</p>
                  </div>
                )}
              </div>
            </div>

            <div>
              <h2 className="text-lg font-semibold mb-2">Upload Thumbnail</h2>
              <div
                {...getThumbnailRootProps()}
                className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-gray-400 transition-colors"
              >
                <input {...getThumbnailInputProps()} />
                {thumbnail ? (
                  <img
                    src={thumbnail || "/placeholder.svg"}
                    alt="Thumbnail"
                    className="mx-auto max-h-40 object-contain"
                  />
                ) : (
                  <div>
                    <ImageIcon className="mx-auto h-12 w-12 text-gray-400" />
                    <p className="mt-2">Drag and drop an image file here, or click to select a file</p>
                  </div>
                )}
              </div>
            </div>

            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                Title
              </label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter video title"
                required
              />
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter video description"
                rows={4}
              />
            </div>

            <Button type="submit">Publish Video</Button>
          </form>
        </main>
  )
}


