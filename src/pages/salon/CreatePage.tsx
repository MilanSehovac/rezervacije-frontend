import { Card, CardContent } from '../../components/ui/card';
import { CheckCircle2 } from 'lucide-react';
import Heading from '../../components/salon/create/Heading';
import Benefits from '../../components/salon/create/Benefits';
import SuccessModal from '../../components/salon/create/SuccessModal';
import StepBasicInfo from '../../components/salon/create/StepBasicInfo';
import StepDetails from '../../components/salon/create/StepDetails';
import StepServices from '../../components/salon/create/StepServices';
import type { SalonFormData, TeamMember } from '../../components/types';
import { useSalonForm } from '../../components/salon/hooks/useSalonForm';

interface ListSalonFormProps {
  onSubmit?: (data: SalonFormData & { teamMembers: TeamMember[] }) => void;
}

export function CreatePage({ onSubmit }: ListSalonFormProps) {
  const {
    currentStep,
    setCurrentStep,
    formData,
    handleInputChange,
    handleDayToggle,
    handleTimeChange,
    handleImageUpload,
    removeImage,
    teamMembers,
    addTeamMember,
    removeTeamMember,
    handleServiceToggle,
    handleServiceUpdate,
    handleCustomServiceAdd,
    isSubmitting,
    submitError,
    handleSubmit,
    handleNewListing,
    imagePreview,
    showSuccessModal,
    setShowSuccessModal,
  } = useSalonForm(onSubmit);

  const totalSteps = 3;
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <Heading />
      {/* Progress Indicator */}
      <Card className="border-0 shadow-lg">
        <CardContent className="p-6">
          <div className="flex items-center justify-center gap-4">
            {[1, 2, 3].map(step => (
              <div key={step} className="flex items-center gap-4">
                <div className="flex flex-col items-center gap-2">
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center text-sm font-medium transition-all ${
                      currentStep === step
                        ? 'bg-primary text-primary-foreground shadow-lg'
                        : currentStep > step
                        ? 'bg-green-600 text-white'
                        : 'bg-muted text-muted-foreground'
                    }`}
                  >
                    {currentStep > step ? <CheckCircle2 className="w-6 h-6" /> : step}
                  </div>
                  <span className="text-sm font-medium hidden sm:block">
                    {step === 1 ? 'Basic Info' : step === 2 ? 'Details' : 'Services'}
                  </span>
                </div>
                {step < totalSteps && <div className="w-16 h-[2px] bg-border rounded-full"></div>}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      {/* Form Steps */}
      {currentStep === 1 && (
        <StepBasicInfo
          formData={formData}
          imagePreview={imagePreview}
          onChange={handleInputChange}
          onNext={() => setCurrentStep(2)}
          onUpload={handleImageUpload}
          onRemoveImage={removeImage}
        />
      )}

      {currentStep === 2 && (
        <StepDetails
          formData={formData}
          onChange={handleInputChange}
          onNext={() => setCurrentStep(3)}
          onBack={() => setCurrentStep(1)}
          onTimeChange={handleTimeChange}
          onDayChange={handleDayToggle}
        />
      )}

      {currentStep === 3 && (
        <StepServices
          formData={formData}
          serviceToggle={handleServiceToggle}
          onBack={() => setCurrentStep(2)}
          onChange={handleInputChange}
          onSubmit={handleSubmit}
          teamMembers={teamMembers}
          onAddTeamMember={addTeamMember}
          onRemoveTeamMember={removeTeamMember}
          onServiceUpdate={handleServiceUpdate}
          onAddCustomService={handleCustomServiceAdd}
          isSubmitting={isSubmitting}
          submitError={submitError}
        />
      )}

      <Benefits />
      <SuccessModal open={showSuccessModal} onOpenChange={setShowSuccessModal} newListing={handleNewListing} />
    </div>
  );
}