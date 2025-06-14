// src/components/modals/ReportBlockModal.tsx
import React, { useState } from 'react';
import { AlertTriangle, Shield, X, Flag } from 'lucide-react';
import Modal from '../common/Modal';
import * as api from '../../utils/api';

interface ReportBlockModalProps {
  isOpen: boolean;
  onClose: () => void;
  profileId: number;
  profileName: string;
  mode: 'report' | 'block';
  onComplete: () => void;
}

const REPORT_REASONS = [
  {
    id: 'fake_profile',
    label: 'Fake Profile',
    description: 'This appears to be a fake account or stolen photos'
  },
  {
    id: 'inappropriate_content',
    label: 'Inappropriate Content',
    description: 'Inappropriate photos or content in profile'
  },
  {
    id: 'spam',
    label: 'Spam or Promotional',
    description: 'Promoting business, social media, or other services'
  },
  {
    id: 'harassment',
    label: 'Harassment',
    description: 'Sending inappropriate or threatening messages'
  },
  {
    id: 'minor',
    label: 'Underage User',
    description: 'This person appears to be under 18'
  },
  {
    id: 'scam',
    label: 'Scam or Fraud',
    description: 'Attempting to scam or get money/personal information'
  },
  {
    id: 'other',
    label: 'Other',
    description: 'Something else that violates community guidelines'
  }
];

export const ReportBlockModal: React.FC<ReportBlockModalProps> = ({
  isOpen,
  onClose,
  profileId,
  profileName,
  mode,
  onComplete
}) => {
  const [selectedReason, setSelectedReason] = useState('');
  const [additionalDetails, setAdditionalDetails] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isConfirming, setIsConfirming] = useState(false);

  const handleSubmit = async () => {
    if (mode === 'report' && !selectedReason) {
      return;
    }

    setIsSubmitting(true);
    try {
      if (mode === 'report') {
        await api.reportProfile(profileId, selectedReason, additionalDetails);
      } else {
        await api.blockProfile(profileId);
      }
      
      onComplete();
      onClose();
      resetForm();
    } catch (error) {
      console.error(`Failed to ${mode} user:`, error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setSelectedReason('');
    setAdditionalDetails('');
    setIsConfirming(false);
  };

  const handleClose = () => {
    onClose();
    resetForm();
  };

  if (mode === 'block' && !isConfirming) {
    return (
      <Modal
        isOpen={isOpen}
        onClose={handleClose}
        title="Block User"
        size="md"
      >
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Shield className="w-8 h-8 text-red-600" />
          </div>
          
          <h3 className="text-lg font-semibold text-gray-800 mb-2">
            Block {profileName}?
          </h3>
          
          <p className="text-gray-600 mb-6">
            This user will no longer be able to see your profile, send you messages, 
            or appear in your search results. They won't be notified that you've blocked them.
          </p>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <div className="flex items-start space-x-3">
              <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />
              <div className="text-left">
                <h4 className="font-medium text-yellow-800">Before you block:</h4>
                <p className="text-sm text-yellow-700 mt-1">
                  Consider reporting the user if they've violated our community guidelines. 
                  This helps keep the platform safe for everyone.
                </p>
              </div>
            </div>
          </div>

          <div className="flex space-x-3">
            <button
              onClick={handleClose}
              className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={() => setIsConfirming(true)}
              className="flex-1 bg-red-500 text-white py-3 rounded-lg hover:bg-red-600 transition-colors"
            >
              Block User
            </button>
          </div>
        </div>
      </Modal>
    );
  }

  if (mode === 'block' && isConfirming) {
    return (
      <Modal
        isOpen={isOpen}
        onClose={handleClose}
        title="Confirm Block"
        size="md"
      >
        <div className="text-center">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Are you sure you want to block {profileName}?
          </h3>
          
          <p className="text-gray-600 mb-6">
            This action cannot be undone. You'll need to contact support to unblock this user.
          </p>

          <div className="flex space-x-3">
            <button
              onClick={() => setIsConfirming(false)}
              className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Go Back
            </button>
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="flex-1 bg-red-500 text-white py-3 rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50"
            >
              {isSubmitting ? 'Blocking...' : 'Yes, Block User'}
            </button>
          </div>
        </div>
      </Modal>
    );
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Report User"
      size="lg"
    >
      <div>
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
            <Flag className="w-6 h-6 text-red-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-800">
              Report {profileName}
            </h3>
            <p className="text-gray-600">
              Help us keep the community safe by reporting violations
            </p>
          </div>
        </div>

        <div className="space-y-4 mb-6">
          <h4 className="font-medium text-gray-800">Why are you reporting this user?</h4>
          
          <div className="space-y-2">
            {REPORT_REASONS.map((reason) => (
              <label
                key={reason.id}
                className={`block p-4 border rounded-lg cursor-pointer transition-colors ${
                  selectedReason === reason.id
                    ? 'border-red-500 bg-red-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-start space-x-3">
                  <input
                    type="radio"
                    name="reportReason"
                    value={reason.id}
                    checked={selectedReason === reason.id}
                    onChange={(e) => setSelectedReason(e.target.value)}
                    className="mt-1 accent-red-500"
                  />
                  <div>
                    <div className="font-medium text-gray-800">{reason.label}</div>
                    <div className="text-sm text-gray-600">{reason.description}</div>
                  </div>
                </div>
              </label>
            ))}
          </div>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Additional Details (Optional)
          </label>
          <textarea
            value={additionalDetails}
            onChange={(e) => setAdditionalDetails(e.target.value)}
            placeholder="Provide any additional context that might help us review this report..."
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none"
            rows={4}
            maxLength={500}
          />
          <div className="text-right text-sm text-gray-500 mt-1">
            {additionalDetails.length}/500
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <div className="flex items-start space-x-3">
            <AlertTriangle className="w-5 h-5 text-blue-600 mt-0.5" />
            <div>
              <h4 className="font-medium text-blue-800">What happens next?</h4>
              <p className="text-sm text-blue-700 mt-1">
                Our team will review your report within 24 hours. If we find violations, 
                appropriate action will be taken. False reports may result in account restrictions.
              </p>
            </div>
          </div>
        </div>

        <div className="flex space-x-3">
          <button
            onClick={handleClose}
            className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={!selectedReason || isSubmitting}
            className="flex-1 bg-red-500 text-white py-3 rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50"
          >
            {isSubmitting ? 'Submitting...' : 'Submit Report'}
          </button>
        </div>
      </div>
    </Modal>
  );
};
