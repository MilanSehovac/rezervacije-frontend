import { useState } from 'react';
import type { SalonFormChange, SalonFormData, TeamMember, SalonService } from '../../types';
import type { TimeType } from '../../constants/salon';
import { createSalon, uploadSalonImages } from '../../../helpers/salonHelpers';
import { useAuth } from '../../context/AuthContext';
import { getErrorMessage } from '../../../helpers/errors';

export const getInitialFormData = (): SalonFormData => ({
  businessName: '',
  category: 'beauty-salon',
  description: '',
  images: [],
  email: '',
  phone: '',
  website: '',
  instagram: '',
  facebook: '',
  twitter: '',
  address: '',
  city: '',
  state: '',
  zipCode: '',
  seats: null,
  timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'Europe/Sarajevo',
  daysOfOperation: {
    monday: { enabled: true, open: '09:00', close: '18:00' },
    tuesday: { enabled: true, open: '09:00', close: '18:00' },
    wednesday: { enabled: true, open: '09:00', close: '18:00' },
    thursday: { enabled: true, open: '09:00', close: '18:00' },
    friday: { enabled: true, open: '09:00', close: '18:00' },
    saturday: { enabled: true, open: '10:00', close: '16:00' },
    sunday: { enabled: false, open: '10:00', close: '16:00' },
  },
  services: [],
  specialties: [],
  cancellationPolicy: '',
});

export const useSalonForm = (onSubmit?: (data: SalonFormData & { teamMembers: TeamMember[] }) => void) => {
  const { refreshSession } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<SalonFormData>(getInitialFormData());
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [imagePreview, setImagePreview] = useState<string[]>([]);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const handleInputChange: SalonFormChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };
  const handleDayToggle = (day: string) => {
    setFormData(prev => ({
      ...prev,
      daysOfOperation: {
        ...prev.daysOfOperation,
        [day]: {
          ...prev.daysOfOperation[day as keyof typeof prev.daysOfOperation],
          enabled: !prev.daysOfOperation[day as keyof typeof prev.daysOfOperation].enabled,
        },
      },
    }));
  };
  const handleTimeChange = (day: string, type: TimeType, value: string) => {
    setFormData(prev => ({
      ...prev,
      daysOfOperation: {
        ...prev.daysOfOperation,
        [day]: {
          ...prev.daysOfOperation[day as keyof typeof prev.daysOfOperation],
          [type]: value,
        },
      },
    }));
  };
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    const previews = files.map(file => URL.createObjectURL(file));
    setImagePreview(prev => [...prev, ...previews]);
    setFormData(prev => ({
      ...prev,
      images: [...prev.images, ...files],
    }));
  };
  const removeImage = (index: number) => {
    setImagePreview(prev => prev.filter((_, i) => i !== index));
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };
  const addTeamMember = (member: Omit<TeamMember, 'id'>) => {
    const newMember: TeamMember = {
      ...member,
      id: Date.now().toString()
    };
    setTeamMembers(prev => [...prev, newMember]);
  };
  const removeTeamMember = (id: TeamMember['id']) => {
    setTeamMembers(prev => prev.filter(m => m.id !== id));
  };
  const handleServiceToggle = (service: SalonService) => {
    setFormData(prev => ({
      ...prev,
      services: prev.services.find(s => s.id === service.id)
        ? prev.services.filter(s => s.id !== service.id)
        : [...prev.services, service],
    }));
  };
  const handleServiceUpdate = (id: SalonService['id'], patch: Partial<SalonService>) => {
    setFormData(prev => ({
      ...prev,
      services: prev.services.map(s => (s.id === id ? { ...s, ...patch } : s)),
    }));
  };
  const handleCustomServiceAdd = () => {
    const service: SalonService = {
      id: `custom_${Date.now()}`,
      name: 'New service',
      activeDuration: 30,
      passiveDuration: 0,
      phases: [{ type: 'active', duration: 30 }],
      price: 20,
      requiredStaff: 1,
      requiredSeats: 1,
      canOverlap: false,
    };
    setFormData(prev => ({ ...prev, services: [...prev.services, service] }));
  };
  const handleSubmit = async () => {
    setSubmitError('');
    setIsSubmitting(true);
    try {
      // image files cannot be sent as JSON (the API has no upload endpoint yet)
      const finalData = { ...formData, images: [] as unknown as File[], teamMembers };
      await createSalon(finalData);
      if (formData.images.length > 0) {
        // photos go up as multipart once the salon exists; a failed upload must not undo the salon
        try {
          await uploadSalonImages(formData.images);
        } catch (uploadError) {
          console.error('Photo upload failed', uploadError);
        }
      }
      onSubmit?.({ ...formData, teamMembers });
      await refreshSession();
      setShowSuccessModal(true);
    } catch (error) {
      setSubmitError(getErrorMessage(error, 'Could not create your salon. Please check the form and try again.'));
    } finally {
      setIsSubmitting(false);
    }
  };
  const handleNewListing = () => {
    setShowSuccessModal(false);
    setFormData(getInitialFormData());
    setTeamMembers([]);
    setImagePreview([]);
    setCurrentStep(1);
  };
  return {
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
    handleSubmit,
    isSubmitting,
    submitError,
    handleNewListing,
    imagePreview,
    showSuccessModal,
    setShowSuccessModal,
  };
};
