import { useEffect, useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';

export default function ApplicationStatus() {
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [applications, setApplications] = useState([]);
  const [requestedDocInputs, setRequestedDocInputs] = useState({});
  const [submittingId, setSubmittingId] = useState('');

  const query = new URLSearchParams(location.search);
  const selectedApplicationId = query.get('applicationId');

  const documentOptions = [
    { value: 'nid', label: 'NID' },
    { value: 'birthCertificate', label: 'Birth Certificate' },
    { value: 'passport', label: 'Passport' },
    { value: 'drivingLicense', label: 'Driving License' },
    { value: 'tin', label: 'TIN' },
    { value: 'citizenship', label: 'Citizenship' },
    { value: 'educationalCertificate', label: 'Educational Certificate' }
  ];

  const getDocumentLabel = (docValue) => {
    return documentOptions.find((doc) => doc.value === docValue)?.label || docValue;
  };

  const formatDate = (value) => {
    if (!value) return 'Not set by admin yet';
    return new Date(value).toLocaleString('en-BD', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatScheduleDate = (value, status) => {
    if (!value) {
      return status === 'approved' ? 'Not required' : 'Not set by admin yet';
    }

    return formatDate(value);
  };

  const isSubmissionDatePassed = (dateValue) => {
    if (!dateValue) return false;

    const raw = String(dateValue);
    const datePart = raw.includes('T') ? raw.slice(0, 10) : raw;
    const [year, month, day] = datePart.split('-').map(Number);

    if (year && month && day) {
      const deadline = new Date(year, month - 1, day, 23, 59, 59, 999);
      return Date.now() > deadline.getTime();
    }

    const fallback = new Date(dateValue);
    if (Number.isNaN(fallback.getTime())) return false;
    fallback.setHours(23, 59, 59, 999);
    return Date.now() > fallback.getTime();
  };

  const fetchMyApplications = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setApplications([]);
      return;
    }

    setLoading(true);
    try {
      const res = await axios.get('http://localhost:5000/api/service-applications/my', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const apps = res.data || [];
      setApplications(apps);

      const inputMap = {};
      apps.forEach((app) => {
        const refs = {};
        (app.adminRequestedDocuments || []).forEach((docType) => {
          const existing = (app.submittedRequestedDocuments || []).find((d) => d.documentType === docType);
          refs[docType] = existing?.reference || '';
        });
        inputMap[app._id] = refs;
      });
      setRequestedDocInputs(inputMap);
    } catch (error) {
      console.error('Error fetching application status:', error);
      setApplications([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyApplications();
  }, []);

  const sortedApplications = useMemo(() => {
    const list = [...applications];
    list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    // If coming from notification link, show only that specific application
    if (selectedApplicationId) {
      return list.filter((app) => app._id === selectedApplicationId);
    }

    return list;
  }, [applications, selectedApplicationId]);

  const handleRequestedDocInput = (appId, docType, value) => {
    setRequestedDocInputs((prev) => ({
      ...prev,
      [appId]: {
        ...(prev[appId] || {}),
        [docType]: value
      }
    }));
  };

  const submitRequestedDocuments = async (app) => {
    try {
      setSubmittingId(app._id);
      const token = localStorage.getItem('token');
      const documentDetails = (app.adminRequestedDocuments || []).map((docType) => ({
        documentType: docType,
        reference: requestedDocInputs[app._id]?.[docType] || ''
      }));

      await axios.patch(
        `http://localhost:5000/api/service-applications/${app._id}/documents`,
        { documentDetails },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert('Requested documents submitted successfully');
      fetchMyApplications();
    } catch (error) {
      console.error('Error submitting requested documents:', error);
      const message = error.response?.data?.message || 'Failed to submit requested documents';

      if (message.includes('Request admin permission before submitting requested documents')) {
        try {
          await requestDocumentEditPermission(app._id);
          return;
        } catch (permissionError) {
          console.error('Error auto-requesting permission:', permissionError);
        }
      }

      alert(message);
    } finally {
      setSubmittingId('');
    }
  };

  const requestDocumentEditPermission = async (appId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.patch(
        `http://localhost:5000/api/service-applications/${appId}/documents/request-edit`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert('Permission request sent to admin');
      fetchMyApplications();
    } catch (error) {
      console.error('Error requesting edit permission:', error);
      alert(error.response?.data?.message || 'Failed to request edit permission');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8 bg-gradient-to-r from-indigo-700 to-blue-800 rounded-2xl shadow-lg p-8 text-white">
          <h1 className="text-4xl font-bold mb-2">Application Updates</h1>
          <p className="text-blue-100 text-lg">See admin status changes, schedule dates, and submit requested documents</p>
        </div>

        {loading ? (
          <div className="bg-white rounded-xl shadow-sm p-8 text-center text-gray-600">Loading applications...</div>
        ) : sortedApplications.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-8 text-center text-gray-500">No applications found.</div>
        ) : (
          <div className="space-y-5">
            {sortedApplications.map((app) => {
              const isHighlighted = app._id === selectedApplicationId;
              const alreadySubmitted = (app.submittedRequestedDocuments || []).length > 0;
              const canUpdate = app.documentEditPermissionGranted === true;
              const waitingApproval = app.documentEditRequested === true;
              const submissionDatePassed = isSubmissionDatePassed(app.documentSubmissionDate);
              const needsLateSubmissionApproval = !alreadySubmitted && submissionDatePassed;
              const needsAdminApproval = (alreadySubmitted || needsLateSubmissionApproval) && !canUpdate;
              return (
                <div
                  key={app._id}
                  className={`bg-white rounded-xl shadow-sm border p-5 ${
                    isHighlighted ? 'border-blue-500 ring-2 ring-blue-200' : 'border-gray-200'
                  }`}
                >
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800">{app.serviceId?.name || 'Service'}</h3>
                      <p className="text-sm text-gray-500">Status: {app.status}</p>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-3 gap-3 text-sm mb-4">
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                      <p className="font-medium text-gray-700 mb-1">Application Deadline</p>
                      <p className="text-gray-600">{formatScheduleDate(app.applicationDeadline, app.status)}</p>
                    </div>
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                      <p className="font-medium text-gray-700 mb-1">Document Submission Date</p>
                      <p className="text-gray-600">{formatScheduleDate(app.documentSubmissionDate, app.status)}</p>
                    </div>
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                      <p className="font-medium text-gray-700 mb-1">Appointment Date</p>
                      <p className="text-gray-600">{formatScheduleDate(app.appointmentDate, app.status)}</p>
                    </div>
                  </div>

                  {(app.adminRequestedDocuments || []).length > 0 && (
                    <div className="border-t pt-4">
                      <p className="font-medium text-gray-800 mb-3">Documents Requested By Admin</p>
                      <div className="grid md:grid-cols-2 gap-3">
                        {app.adminRequestedDocuments.map((docType) => (
                          <div key={`${app._id}-${docType}`}>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              {getDocumentLabel(docType)} *
                            </label>
                            <input
                              type="text"
                              value={requestedDocInputs[app._id]?.[docType] || ''}
                              onChange={(e) => handleRequestedDocInput(app._id, docType, e.target.value)}
                              readOnly={needsAdminApproval}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                              placeholder={`Enter ${getDocumentLabel(docType)} reference`}
                            />
                          </div>
                        ))}
                      </div>

                      <div className="mt-3 flex justify-end">
                        <button
                          type="button"
                          onClick={() => {
                            if (needsAdminApproval) {
                              requestDocumentEditPermission(app._id);
                            } else {
                              submitRequestedDocuments(app);
                            }
                          }}
                          disabled={submittingId === app._id || waitingApproval}
                          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-60"
                        >
                          {waitingApproval
                            ? 'Waiting Admin Approval'
                            : needsAdminApproval
                              ? 'Request Admin Permission'
                              : (submittingId === app._id ? 'Submitting...' : 'Submit Requested Documents')}
                        </button>
                      </div>
                      {alreadySubmitted && !canUpdate && !waitingApproval && (
                        <p className="text-xs text-amber-700 mt-2 text-right">
                          Already submitted. If you made a mistake, request admin permission to update.
                        </p>
                      )}
                      {needsLateSubmissionApproval && !canUpdate && !waitingApproval && (
                        <p className="text-xs text-amber-700 mt-2 text-right">
                          Submission date has passed. Request admin permission before submitting requested documents.
                        </p>
                      )}
                      {canUpdate && (
                        <p className="text-xs text-green-700 mt-2 text-right">
                          Admin permission approved. You can submit requested documents now.
                        </p>
                      )}
                      {waitingApproval && (
                        <p className="text-xs text-blue-700 mt-2 text-right">
                          Permission request sent. Wait for admin approval.
                        </p>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
