import { ImageIcon, Store, Upload, X } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../ui/card";
import { Label } from "../../ui/label";
import { Input } from "../../ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../ui/select";
import { Textarea } from "../../ui/textarea";
import { Button } from "../../ui/button";
import type { SalonFormChange, SalonFormData } from "../../types"
import { SALON_CATEGORIES } from "../../constants/salon";

interface Props {
    formData: SalonFormData;
    imagePreview: string[];
    onChange: SalonFormChange;
    onNext: () => void;
    onUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onRemoveImage: (index: number) => void;
}
const StepBasicInfo = ({ 
    formData,
    imagePreview,
    onChange,
    onNext,
    onUpload,
    onRemoveImage
}:Props) => {

  return (
    <Card className="border-0 shadow-lg">
    <CardHeader>
      <CardTitle className="flex items-center gap-2">
        <Store className="w-5 h-5" />
        Basic Information
      </CardTitle>
      <CardDescription>
        Tell us about your business and what makes it special
      </CardDescription>
    </CardHeader>
    <CardContent className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="businessName">Business Name *</Label>
        <Input
          id="businessName"
          placeholder="e.g., Luxe Hair Studio"
          value={formData.businessName}
          onChange={(e) => onChange('businessName', e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="category">Category *</Label>
        <Select
          value={formData.category}
          onValueChange={(value) => onChange('category', value as SalonFormData['category'])}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select your business type" />
          </SelectTrigger>
          <SelectContent>
            {SALON_CATEGORIES.map((cat) => (
              <SelectItem key={cat.value} value={cat.value}>
                {cat.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description *</Label>
        <Textarea
          id="description"
          placeholder="Describe your salon, its atmosphere, and what sets you apart..."
          value={formData.description}
          onChange={(e) => onChange('description', e.target.value)}
          rows={4}
        />
        <p className="text-sm text-muted-foreground">
          Minimum 50 characters ({formData.description.length}/50)
        </p>
      </div>

      <div className="space-y-2">
        <Label>Business Photos</Label>
        <input
          type="file"
          id="imageUpload"
          accept="image/*"
          multiple
          className="hidden"
          onChange={onUpload}
        />
        <div 
          className="border-2 border-dashed border-border rounded-xl p-8 text-center hover:border-primary transition-colors cursor-pointer"
          onClick={() => document.getElementById('imageUpload')?.click()}
        >
          <ImageIcon className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-sm text-muted-foreground mb-2">
            Drag and drop photos or click to browse
          </p>
          <Button variant="outline" size="sm" className="gap-2" type="button">
            <Upload className="w-4 h-4" />
            Upload Photos
          </Button>
        </div>
        
        {/* Image Previews */}
        {imagePreview.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
            {imagePreview.map((preview, index) => (
              <div key={index} className="relative group">
                <img
                  src={preview}
                  alt={`Preview ${index + 1}`}
                  className="w-full h-32 object-cover rounded-lg"
                />
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onRemoveImage(index);
                  }}
                  className="absolute top-2 right-2 bg-destructive text-destructive-foreground rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="flex justify-end">
        <Button
          onClick={onNext}
          disabled={!formData.businessName || !formData.category || formData.description.length < 50}
          className="bg-gradient-primary"
        >
          Continue to Details
        </Button>
      </div>
    </CardContent>
  </Card>
  )
}

export default StepBasicInfo