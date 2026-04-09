import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaSearch, FaCheckCircle, FaTimesCircle, FaClock, FaSave } from 'react-icons/fa';

export default function ServiceApplications() {
  const navigate = useNavigate();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [savingId, setSavingId] = useState('');
  const [editMap, setEditMap] = useState({});

  const documentOptions = [
    { value: 'none', label: 'None' },
    { value: 'nid', label: 'NID' },
    { value: 'birthCertificate', label: 'Birth Certificate' },
    { value: 'passport', label: 'Passport' },
    { value: 'drivingLicense', label: 'Driving License' },
    { value: 'tin', label: 'TIN' },
    { value: 'citizenship', label: 'Citizenship' },
    { value: 'educationalCertificate', label: 'Educational Certificate' }
  ];

  const ensureAdmin = () => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (user.role !== 'admin') {
      navigate('/');
      return false;
    }
    return true;
  };

  const fetchApplications = async () => {
    if (!ensureAdmin()) return;

    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('http://localhost:5000/api/service-applications/admin/all', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const activeApplications = (res.data || []).filter((app) => app.status !== 'approved');
      setApplications(activeApplications);

      const initialMap = {};
      activeApplications.forEach((app) => {
        initialMap[app._id] = {
          status: app.status || 'pending',
          applicationDeadline: app.applicationDeadline ? new Date(app.applicationDeadline).toISOString().slice(0, 10) : '',
          documentSubmissionDate: app.documentSubmissionDate ? new Date(app.documentSubmissionDate).toISOString().slice(0, 10) : '',
          appointmentDate: app.appointmentDate ? new Date(app.appointmentDate).toISOString().slice(0, 16) : '',
          reminderEnabled: app.reminderEnabled !== false,
          adminRequestedDocuments: app.adminRequestedDocuments || []
        };
      });
      setEditMap(initialMap);
    } catch (error) {
      console.error('Error fetching service applications:', error);
      alert(error.response?.data?.message || 'Failed to fetch service applications');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const filteredApplications = useMemo(() => {
    return applications.filter((app) => {
      const byStatus = statusFilter === 'all' || app.status === statusFilter;
      const text = `${app.serviceId?.name || ''} ${app.applicantName || ''} ${app.email || ''} ${app.phone || ''}`.toLowerCase();
      const bySearch = text.includes(search.toLowerCase());
      return byStatus && bySearch;
    });
  }, [applications, search, statusFilter]);

  const groupedApplications = useMemo(() => {
    const groupedMap = filteredApplications.reduce((acc, app) => {
      const serviceName = app.serviceId?.name || 'Unknown Service';

      if (!acc[serviceName]) {
        acc[serviceName] = [];
      }

      acc[serviceName].push(app);
      return acc;
    }, {});

    return Object.entries(groupedMap)
      .map(([serviceName, items]) => ({
        serviceName,
        items: [...items].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      }))
      .sort((a, b) => a.serviceName.localeCompare(b.serviceName));
  }, [filteredApplications]);

  const handleFieldChange = (appId, field, value) => {
    setEditMap((prev) => ({
      ...prev,
      [appId]: {
        ...prev[appId],
        [field]: value
      }
    }));
  };

  const toggleRequestedDocument = (appId, docValue) => {
    setEditMap((prev) => {
      const current = prev[appId]?.adminRequestedDocuments || [];

      if (docValue === 'none') {
        return {
          ...prev,
          [appId]: {
            ...prev[appId],
            adminRequestedDocuments: []
          }
        };
      }

      const exists = current.includes(docValue);
      return {
        ...prev,
        [appId]: {
          ...prev[appId],
          adminRequestedDocuments: exists
            ? current.filter((d) => d !== docValue)
            : [...current, docValue]
        }
      };
    });
  };

  const saveReview = async (appId) => {
    try {
      setSavingId(appId);
      const token = localStorage.getItem('token');
      const payload = editMap[appId] || {};

      await axios.patch(`http://localhost:5000/api/service-applications/admin/${appId}/review`, payload, {
        headers: { Authorization: `Bearer ${token}` }
      });

      await fetchApplications();
    } catch (error) {
      console.error('Error saving review:', error);
      alert(error.response?.data?.message || 'Failed to update application');
    } finally {
      setSavingId('');
    }
  };

  const grantDocumentEditPermission = async (appId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.patch(
        `http://localhost:5000/api/service-applications/admin/${appId}/document-edit-permission`,
        { allow: true },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      await fetchApplications();
    } catch (error) {
      console.error('Error granting document edit permission:', error);
      alert(error.response?.data?.message || 'Failed to grant document edit permission');
    }
  };

  const statusBadge = (status) => {
    if (status === 'approved') {
      return <span className="px-2 py-1 rounded-full text-xs bg-green-100 text-green-700 inline-flex items-center gap-1"><FaCheckCircle /> Approved</span>;
    }
    if (status === 'rejected') {
      return <span className="px-2 py-1 rounded-full text-xs bg-red-100 text-red-700 inline-flex items-center gap-1"><FaTimesCircle /> Rejected</span>;
    }
    return <span className="px-2 py-1 rounded-full text-xs bg-yellow-100 text-yellow-700 inline-flex items-center gap-1"><FaClock /> Pending</span>;
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8 bg-gradient-to-r from-blue-700 to-indigo-800 rounded-2xl shadow-lg p-8 text-white">
          <h1 className="text-4xl font-bold mb-2">Service Applications</h1>
          <p className="text-blue-100 text-lg">Review citizen applications and assign deadlines/appointments</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-4 mb-6 flex flex-col md:flex-row gap-3">
          <div className="flex-1 relative">
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by service, name, email, phone"
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>

        {loading ? (
          <div className="text-center py-10 text-gray-600">Loading applications...</div>
        ) : filteredApplications.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-10 text-center text-gray-500">No service applications found.</div>
        ) : (
          <div className="space-y-6">
            {groupedApplications.map((group) => (
              <div key={group.serviceName} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between gap-3 border-b border-gray-200 pb-3 mb-4">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800">{group.serviceName}</h3>
                    <p className="text-sm text-gray-500">
                      {group.items[0]?.serviceId?.department || 'N/A'} • {group.items.length} application(s)
                    </p>
                  </div>
                </div>

                <div className="space-y-5">
                  {group.items.map((app) => {
                    const edit = editMap[app._id] || {};
                    const isReviewed = Boolean(app.reviewedAt);
                    const hasAnySchedule = Boolean(edit.applicationDeadline || edit.documentSubmissionDate || edit.appointmentDate);
                    const hasCompleteSchedule = Boolean(edit.applicationDeadline && edit.documentSubmissionDate && edit.appointmentDate);
                    const canSave = Boolean(
                      edit.status &&
                      (!hasAnySchedule || hasCompleteSchedule) &&
                      Array.isArray(edit.adminRequestedDocuments)
                    );

                    return (
                      <div key={app._id} className="rounded-xl border border-gray-200 bg-gray-50 p-5">
                        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4 mb-4">
                          <div>
                            <h4 className="text-lg font-semibold text-gray-800">{app.applicantName || 'Unknown Applicant'}</h4>
                            <p className="text-sm text-gray-500">Applied: {new Date(app.createdAt).toLocaleString()}</p>
                          </div>
                          <div className="flex flex-wrap gap-2 items-start">
                            {statusBadge(app.status)}
                            {app.documentEditRequested && (
                              <span className="px-2 py-1 rounded-full text-xs bg-amber-100 text-amber-700 font-medium">
                                🔔 Permission Request Pending
                              </span>
                            )}
                            {app.documentEditPermissionGranted && (
                              <span className="px-2 py-1 rounded-full text-xs bg-green-100 text-green-700 font-medium">
                                ✓ Permission Granted
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-4 mb-4 text-sm">
                          <div><span className="font-medium">Email:</span> {app.email}</div>
                          <div><span className="font-medium">Phone:</span> {app.phone}</div>
                          <div><span className="font-medium">NID:</span> {app.nid}</div>
                          <div className="md:col-span-2"><span className="font-medium">Address:</span> {app.address}</div>
                          {app.additionalInfo && (
                            <div className="md:col-span-2"><span className="font-medium">Additional Info:</span> {app.additionalInfo}</div>
                          )}
                        </div>

                        {app.documentDetails?.length > 0 && (
                          <div className="mb-4">
                            <p className="font-medium text-sm mb-2">Document Details</p>
                            <div className="grid md:grid-cols-2 gap-2 text-sm">
                              {app.documentDetails.map((doc, idx) => (
                                <div key={`${doc.documentType}-${idx}`} className="px-3 py-2 rounded-lg bg-white border border-gray-200">
                                  <span className="font-medium">{doc.documentType}:</span> {doc.reference}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {app.submittedRequestedDocuments?.length > 0 && (
                          <div className="mb-4">
                            <p className="font-medium text-sm mb-2">User Submitted (Admin Requested) Documents</p>
                            <div className="grid md:grid-cols-2 gap-2 text-sm">
                              {app.submittedRequestedDocuments.map((doc, idx) => (
                                <div key={`${doc.documentType}-${idx}`} className="px-3 py-2 rounded-lg bg-green-50 border border-green-200">
                                  <span className="font-medium">{doc.documentType}:</span> {doc.reference}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {app.documentEditRequested && (
                          <div className="mb-4 px-3 py-3 rounded-lg border border-amber-300 bg-amber-50 flex items-center justify-between gap-3">
                            <p className="text-sm text-amber-800">User requested permission to submit or update requested documents.</p>
                            <button
                              type="button"
                              onClick={() => grantDocumentEditPermission(app._id)}
                              className="px-3 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 text-sm"
                            >
                              Approve Permission
                            </button>
                          </div>
                        )}

                        {app.documentEditPermissionGranted && (
                          <div className="mb-4 px-3 py-3 rounded-lg border border-green-300 bg-green-50">
                            <p className="text-sm text-green-800 font-medium">
                              ✓ Permission granted - User can submit or update requested documents
                            </p>
                          </div>
                        )}

                        <div className="border-t pt-4 mt-4">
                          <p className="font-medium text-sm mb-3">Admin Review & Scheduling</p>
                          <div className="mb-4">
                            <p className="text-xs text-gray-600 mb-2">Request Additional Documents From User</p>
                            <div className="flex flex-wrap gap-2">
                              {documentOptions.map((doc) => {
                                const selected = doc.value === 'none'
                                  ? (edit.adminRequestedDocuments || []).length === 0
                                  : (edit.adminRequestedDocuments || []).includes(doc.value);
                                return (
                                  <button
                                    key={doc.value}
                                    type="button"
                                    onClick={() => toggleRequestedDocument(app._id, doc.value)}
                                    className={`px-3 py-1 rounded-full text-xs font-medium border ${
                                      selected
                                        ? 'bg-blue-600 text-white border-blue-600'
                                        : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'
                                    }`}
                                  >
                                    {doc.label}
                                  </button>
                                );
                              })}
                            </div>
                          </div>

                          <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-3">
                            <div>
                              <label className="block text-xs text-gray-600 mb-1">Status</label>
                              <select
                                value={edit.status || 'pending'}
                                onChange={(e) => handleFieldChange(app._id, 'status', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                              >
                                <option value="pending">Pending</option>
                                <option value="approved">Approved</option>
                                <option value="rejected">Rejected</option>
                              </select>
                            </div>

                            <div>
                              <label className="block text-xs text-gray-600 mb-1">Application Deadline</label>
                              <input
                                type="date"
                                value={edit.applicationDeadline || ''}
                                onChange={(e) => handleFieldChange(app._id, 'applicationDeadline', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                              />
                            </div>

                            <div>
                              <label className="block text-xs text-gray-600 mb-1">Document Submission</label>
                              <input
                                type="date"
                                value={edit.documentSubmissionDate || ''}
                                onChange={(e) => handleFieldChange(app._id, 'documentSubmissionDate', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                              />
                            </div>

                            <div>
                              <label className="block text-xs text-gray-600 mb-1">Appointment</label>
                              <input
                                type="datetime-local"
                                value={edit.appointmentDate || ''}
                                onChange={(e) => handleFieldChange(app._id, 'appointmentDate', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                              />
                            </div>

                            <div className="flex items-end gap-2">
                              <label className="inline-flex items-center gap-2 text-sm">
                                <input
                                  type="checkbox"
                                  checked={edit.reminderEnabled !== false}
                                  onChange={(e) => handleFieldChange(app._id, 'reminderEnabled', e.target.checked)}
                                />
                                Reminders
                              </label>
                              <button
                                onClick={() => saveReview(app._id)}
                                disabled={savingId === app._id || !canSave}
                                className="ml-auto px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-60 inline-flex items-center gap-1"
                              >
                                <FaSave /> {savingId === app._id ? 'Saving' : isReviewed ? 'Update' : 'Save'}
                              </button>
                            </div>
                          </div>
                          {!canSave && (
                            <p className="text-xs text-red-600 mt-2">
                              Please set all three schedule dates together, or leave all schedule dates empty.
                            </p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
