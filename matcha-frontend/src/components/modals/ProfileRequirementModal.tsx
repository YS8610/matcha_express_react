// src/components/modals/ProfileRequirementModal.tsx
import React from 'react';
import { Camera, Heart, AlertCircle } from 'lucide-react';
import Modal from '../common/Modal';

interface ProfileRequirementModalProps {
  isOpen: boolean;
  onClose: () => void;
  onGoToProfile: () => void;
  requirementType: 'photo' | 'complete';
  missingFields?: string[];
}

const ProfileRequirementModal: React.FC<ProfileRequirementModalProps> = ({
  isOpen,
  onClose,
  onGoToProfile,
  requirementType,
  missingFields = []
}) => {
  const getModalContent = () => {
    if (requirementType === 'photo') {
      return {
        icon: <Camera className="w-16 h-16 text-pink-500" />,
        title: "Profile Picture Required",
        message: "You need to add a profile picture before you can like other users. This helps create a more authentic community where everyone can see who they're connecting with.",
        actionText: "Add Profile Picture"
      };
    } else {
      return {
        icon: <AlertCircle className="w-16 h-16 text-orange-500" />,
        title: "Complete Your Profile",
        message: `Please complete your profile before accessing this feature. You're missing: ${missingFields.join(', ')}.`,
        actionText: "Complete Profile"
      };
    }
  };

  const content = getModalContent();

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title=""
      size="md"
      closeOnOverlayClick={false}
    >
      <div className="text-center p-4">
        <div className="flex justify-center mb-4">
          {content.icon}
        </div>
        
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          {content.title}
        </h2>
        
        <p className="text-gray-600 mb-6 leading-relaxed">
          {content.message}
        </p>

        {requirementType === 'photo' && (
          <div className="bg-pink-50 border border-pink-200 rounded-lg p-4 mb-6">
            <div className="flex items-start space-x-3">
              <Heart className="w-5 h-5 text-pink-600 mt-0.5" />
              <div className="text-left">
                <h4 className="font-medium text-pink-800">Why is this required?</h4>
                <p className="text-sm text-pink-700 mt-1">
                  Profile pictures create trust and authenticity. Users with photos receive 
                  10x more likes and matches than those without.
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="space-y-3">
          <button
            onClick={onGoToProfile}
            className="w-full bg-pink-500 text-white py-3 px-6 rounded-lg hover:bg-pink-600 transition-colors font-medium"
          >
            {content.actionText}
          </button>
          
          <button
            onClick={onClose}
            className="w-full bg-gray-100 text-gray-700 py-3 px-6 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Maybe Later
          </button>
        </div>

        {requirementType === 'photo' && (
          <div className="mt-4 text-xs text-gray-500">
            <p>Don't worry - you can always change or remove your photo later in your profile settings.</p>
          </div>
        )}
      </div>
    </Modal>
  );
};

export default ProfileRequirementModal;
