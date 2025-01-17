import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Package } from 'lucide-react'
import { ScrollArea } from "@/components/ui/scroll-area"

interface Product {
  id: string
  name: string
  type: "Sólido" | "Líquido"
  nitrogen: number
  phosphate: number
  potassium: number
}

const PRODUCTS: Product[] = [
  {
    id: "custom",
    name: "Producto personalizado",
    type: "Sólido",
    nitrogen: 0,
    phosphate: 0,
    potassium: 0
  },
  {
    id: "azufre",
    name: "Azufre elemental",
    type: "Sólido",
    nitrogen: 0,
    phosphate: 0,
    potassium: 0
  },
  {
    id: "clk",
    name: "CLK (Cloruro de Potasio)",
    type: "Sólido",
    nitrogen: 0,
    phosphate: 0,
    potassium: 60
  },
  {
    id: "dap",
    name: "DAP (Fosfato Diamónico)",
    type: "Sólido",
    nitrogen: 18,
    phosphate: 46,
    potassium: 0
  },
  {
    id: "dolomita",
    name: "Dolomita",
    type: "Sólido",
    nitrogen: 0,
    phosphate: 0,
    potassium: 0
  },
  {
    id: "map",
    name: "MAP (Fosfato Monoamónico)",
    type: "Sólido",
    nitrogen: 11,
    phosphate: 52,
    potassium: 0
  },
  {
    id: "nitrato-amonio",
    name: "Nitrato de Amonio",
    type: "Sólido",
    nitrogen: 33,
    phosphate: 0,
    potassium: 0
  },
  {
    id: "nitrato-amonio-calcareo",
    name: "Nitrato de Amonio Calcáreo",
    type: "Sólido",
    nitrogen: 27,
    phosphate: 0,
    potassium: 0
  },
  {
    id: "sa",
    name: "SA (Sulfato de Amonio)",
    type: "Sólido",
    nitrogen: 21,
    phosphate: 0,
    potassium: 0
  },
  {
    id: "sps",
    name: "SPS (Superfosfato simple)",
    type: "Sólido",
    nitrogen: 0,
    phosphate: 21,
    potassium: 0
  },
  {
    id: "spt",
    name: "SPT (Superfosfato triple)",
    type: "Sólido",
    nitrogen: 0,
    phosphate: 46,
    potassium: 0
  },
  {
    id: "tsa",
    name: "TSA (Tiosulfato de Amonio)",
    type: "Líquido",
    nitrogen: 12,
    phosphate: 0,
    potassium: 0
  },
  {
    id: "uan28",
    name: "UAN 28",
    type: "Líquido",
    nitrogen: 28,
    phosphate: 0,
    potassium: 0
  },
]

interface ProductsSectionProps {
  products: Product[]
  onChange: (products: Product[]) => void
}

export function ProductsSection({ products, onChange }: ProductsSectionProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedProduct, setSelectedProduct] = useState<string>("")
  const [customValues, setCustomValues] = useState({
    nitrogen: 0,
    phosphate: 0,
    potassium: 0
  })

  const filteredProducts = PRODUCTS.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleAddProduct = () => {
    const productToAdd = selectedProduct === 'custom'
      ? {
        id: 'custom-' + Date.now(),
        name: "Producto personalizado",
        type: "Sólido" as const,
        ...customValues
      }
      : PRODUCTS.find(p => p.id === selectedProduct)

    if (productToAdd) {
      onChange([...products, productToAdd])
      setSelectedProduct("")
      setCustomValues({ nitrogen: 0, phosphate: 0, potassium: 0 })
    }
  }

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Agricultural Inputs</h2>

      <div className="relative">
        <Input
          type="search"
          placeholder="Search products..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full"
        />
      </div>

      <ScrollArea className="h-[400px] border rounded-lg">
        <RadioGroup value={selectedProduct} onValueChange={setSelectedProduct}>
          <div className="p-4 space-y-4">
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                className="grid grid-cols-[auto,1fr,repeat(3,80px)] gap-4 items-center p-4 border rounded-lg hover:bg-accent"
              >
                <RadioGroupItem value={product.id} id={product.id} />
                <div className="space-y-1">
                  <Label htmlFor={product.id} className="font-medium">
                    <Package className="w-4 h-4 inline mr-2" />
                    {product.name}
                  </Label>
                  <div className="text-sm text-muted-foreground">{product.type}</div>
                </div>
                {product.id === 'custom' ? (
                  <>
                    <div>
                      <Label htmlFor="nitrogen">
                        N%
                      </Label>
                      <Input
                        id="custom-nitrogen"
                        type="number"
                        placeholder="N%"
                        className="w-20"
                        value={customValues.nitrogen}
                        onChange={(e) => setCustomValues(prev => ({
                          ...prev,
                          nitrogen: Number(e.target.value)
                        }))}
                      />
                    </div>
                    <div>
                      <Label htmlFor="custom-potassium">
                        P%
                      </Label>
                      <Input
                        id="custom-potassium"
                        type="number"
                        placeholder="P%"
                        className="w-20"
                        value={customValues.phosphate}
                        onChange={(e) => setCustomValues(prev => ({
                          ...prev,
                          phosphate: Number(e.target.value)
                        }))}
                      />
                    </div>
                    <div>
                      <Label htmlFor="custom-phosphate">
                        K%
                      </Label>
                      <Input
                        id="custom-phosphate"
                        type="number"
                        placeholder="K%"
                        className="w-20"
                        value={customValues.potassium}
                        onChange={(e) => setCustomValues(prev => ({
                          ...prev,
                          potassium: Number(e.target.value)
                        }))}
                      />
                    </div>
                  </>
                ) : (
                  <>
                    <div className="w-20 text-center">{product.nitrogen}%</div>
                    <div className="w-20 text-center">{product.phosphate}%</div>
                    <div className="w-20 text-center">{product.potassium}%</div>
                  </>
                )}
              </div>
            ))}
          </div>
        </RadioGroup>
      </ScrollArea>

      <div className="flex justify-end">
        <Button
          type="button"
          variant="outline"
          onClick={handleAddProduct}
          disabled={!selectedProduct}
        >
          Add Product
        </Button>
      </div>

      {products.length > 0 && (
        <div className="space-y-2">
          <h3 className="font-medium">Selected Products</h3>
          <div className="space-y-2">
            {products.map((product, index) => (
              <div
                key={product.id}
                className="flex items-center justify-between p-2 border rounded-lg"
              >
                <div>
                  <div className="font-medium">{product.name}</div>
                  <div className="text-sm text-muted-foreground">
                    N: {product.nitrogen}% - P: {product.phosphate}% - K: {product.potassium}%
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onChange(products.filter((_, i) => i !== index))}
                >
                  Remove
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

