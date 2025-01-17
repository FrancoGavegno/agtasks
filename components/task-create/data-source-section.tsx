import Image from "next/image"
import { useParams } from "next/navigation"


export function DataSourceSection() {
  const {sourceType} = useParams();
  let sourceMap = "";
  let sourceDescription = "";

  if (sourceType === "farm") {
    sourceMap = "/map-source-farm.png"
    sourceDescription = "Type: Farm (Mestizo L1). Location: JCR y EM . RCM SA - El Mestizo"
  }
  if (sourceType === "layer") {
    sourceMap = "/map-source-wfull.png"
    sourceDescription = "Type: Prescription map (L1MAIZ). Location: JCR y EM . RCM SA - El Mestizo"
  } 

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Selected Source</h2>
      <div className="relative w-full h-[300px] rounded-lg overflow-hidden border">
        <Image
          src={sourceMap}
          alt="Field map"
          fill
          className="object-cover"
        />
      </div>
      <p className="text-sm text-muted-foreground">
        {sourceDescription}
      </p>
    </div>
  )
}

