import { useMemo, useState } from 'react';
import apiClient from '../api/client';

const initialForm = {
  customerId: 'C001',
  eventId: '',
  amount: '',
  timestamp: new Date().toISOString().slice(0, 16),
  paymentMethod: 'UPI',
  source: 'BankAPI',
  status: 'confirmed'
};

export default function Dashboard() {
  const [form, setForm] = useState(initialForm);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [stateData, setStateData] = useState(null);
  const [auditEvents, setAuditEvents] = useState([]);

  const selectedCustomerId = useMemo(() => form.customerId.trim(), [form.customerId]);

  const updateFormValue = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const fetchCustomerSections = async (customerId) => {
    if (!customerId) {
      return;
    }

    const [stateResponse, auditResponse] = await Promise.all([
      apiClient.get(`/customers/${customerId}/state`),
      apiClient.get(`/customers/${customerId}/audit`)
    ]);

    setStateData(stateResponse.data);
    setAuditEvents(auditResponse.data.events || []);
  };

  const onLoadCustomer = async () => {
    setErrorMessage('');
    setMessage('');

    try {
      await fetchCustomerSections(selectedCustomerId);
      setMessage('Customer data loaded');
    } catch (error) {
      const apiMessage = error.response?.data?.message;
      setErrorMessage(apiMessage || 'Unable to load customer data');
    }
  };

  const onSubmitEvent = async (event) => {
    event.preventDefault();

    setIsSubmitting(true);
    setMessage('');
    setErrorMessage('');

    try {
      const payload = {
        customerId: form.customerId.trim(),
        eventId: form.eventId.trim(),
        amount: Number(form.amount),
        timestamp: new Date(form.timestamp).toISOString(),
        paymentMethod: form.paymentMethod.trim(),
        source: form.source.trim(),
        status: form.status
      };

      const response = await apiClient.post('/events', payload);

      if (response.data?.duplicate) {
        setMessage('Duplicate event ignored');
      } else {
        setMessage('Event processed');
      }

      await fetchCustomerSections(payload.customerId);
      setForm((prev) => ({ ...prev, eventId: '', amount: '' }));
    } catch (error) {
      const apiMessage = error.response?.data?.message;
      setErrorMessage(apiMessage || 'Unable to submit event');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="mx-auto max-w-6xl px-4 py-6 text-slate-100 sm:px-6 lg:px-8 lg:py-8">
      <section className="rounded-2xl border border-white/15 bg-slate-900/60 p-5 shadow-xl backdrop-blur sm:p-6">
        <h1 className="text-2xl font-semibold text-white sm:text-3xl">EMI Event Dashboard</h1>
        <p className="mt-2 text-sm text-slate-300">Submit events and view customer state, history, and audit in one place.</p>

        <form onSubmit={onSubmitEvent} className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <label className="text-sm text-slate-200">
            Customer ID
            <input
              name="customerId"
              value={form.customerId}
              onChange={updateFormValue}
              required
              className="mt-1 w-full rounded-lg border border-white/15 bg-slate-950/70 px-3 py-2 text-sm text-white outline-none ring-orange-400 transition focus:ring"
            />
          </label>

          <label className="text-sm text-slate-200">
            Event ID
            <input
              name="eventId"
              value={form.eventId}
              onChange={updateFormValue}
              required
              className="mt-1 w-full rounded-lg border border-white/15 bg-slate-950/70 px-3 py-2 text-sm text-white outline-none ring-orange-400 transition focus:ring"
            />
          </label>

          <label className="text-sm text-slate-200">
            Amount
            <input
              name="amount"
              type="number"
              min="1"
              step="0.01"
              value={form.amount}
              onChange={updateFormValue}
              required
              className="mt-1 w-full rounded-lg border border-white/15 bg-slate-950/70 px-3 py-2 text-sm text-white outline-none ring-orange-400 transition focus:ring"
            />
          </label>

          <label className="text-sm text-slate-200">
            Timestamp
            <input
              name="timestamp"
              type="datetime-local"
              value={form.timestamp}
              onChange={updateFormValue}
              required
              className="mt-1 w-full rounded-lg border border-white/15 bg-slate-950/70 px-3 py-2 text-sm text-white outline-none ring-orange-400 transition focus:ring"
            />
          </label>

          <label className="text-sm text-slate-200">
            Payment Method
            <input
              name="paymentMethod"
              value={form.paymentMethod}
              onChange={updateFormValue}
              required
              className="mt-1 w-full rounded-lg border border-white/15 bg-slate-950/70 px-3 py-2 text-sm text-white outline-none ring-orange-400 transition focus:ring"
            />
          </label>

          <label className="text-sm text-slate-200">
            Source
            <input
              name="source"
              value={form.source}
              onChange={updateFormValue}
              required
              className="mt-1 w-full rounded-lg border border-white/15 bg-slate-950/70 px-3 py-2 text-sm text-white outline-none ring-orange-400 transition focus:ring"
            />
          </label>

          <label className="text-sm text-slate-200">
            Status
            <select
              name="status"
              value={form.status}
              onChange={updateFormValue}
              className="mt-1 w-full rounded-lg border border-white/15 bg-slate-950/70 px-3 py-2 text-sm text-white outline-none ring-orange-400 transition focus:ring"
            >
              <option value="confirmed">confirmed</option>
              <option value="pending">pending</option>
              <option value="reversed">reversed</option>
              <option value="corrected">corrected</option>
            </select>
          </label>

          <div className="flex items-end gap-3 sm:col-span-2 lg:col-span-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="rounded-lg bg-orange-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-orange-400 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting ? 'Submitting...' : 'Submit Event'}
            </button>
            <button
              type="button"
              onClick={onLoadCustomer}
              className="rounded-lg border border-white/20 bg-slate-800 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-700"
            >
              Load Customer Data
            </button>
          </div>
        </form>

        {message && <p className="mt-4 rounded-lg border border-emerald-400/30 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-200">{message}</p>}
        {errorMessage && <p className="mt-4 rounded-lg border border-red-400/30 bg-red-500/10 px-3 py-2 text-sm text-red-200">{errorMessage}</p>}
      </section>

      <section className="mt-6 grid gap-6 lg:grid-cols-2">
        <article className="rounded-2xl border border-white/15 bg-slate-900/60 p-5 shadow-xl backdrop-blur sm:p-6">
          <h2 className="text-xl font-semibold text-white">Customer State</h2>
          <div className="mt-4 space-y-2 text-sm text-slate-200">
            <p>
              <span className="text-slate-400">Customer ID:</span> {stateData?.customerId || '-'}
            </p>
            <p>
              <span className="text-slate-400">Current Balance:</span> {stateData?.currentBalance ?? '-'}
            </p>
            <p>
              <span className="text-slate-400">Number of Events:</span> {stateData?.eventCount ?? '-'}
            </p>
          </div>
        </article>

        <article className="rounded-2xl border border-white/15 bg-slate-900/60 p-5 shadow-xl backdrop-blur sm:p-6">
          <h2 className="text-xl font-semibold text-white">Audit</h2>
          <div className="mt-4 overflow-x-auto">
            <table className="min-w-full text-left text-sm text-slate-200">
              <thead>
                <tr className="border-b border-white/15 text-slate-400">
                  <th className="px-2 py-2 font-medium">Action</th>
                  <th className="px-2 py-2 font-medium">Reason</th>
                  <th className="px-2 py-2 font-medium">Event ID</th>
                </tr>
              </thead>
              <tbody>
                {auditEvents.length === 0 ? (
                  <tr>
                    <td colSpan="3" className="px-2 py-3 text-slate-400">
                      No audit records
                    </td>
                  </tr>
                ) : (
                  auditEvents.map((item) => (
                    <tr key={`${item.eventId}-${item.timestamp}`} className="border-b border-white/10">
                      <td className="px-2 py-2">{item.action}</td>
                      <td className="px-2 py-2">{item.reason}</td>
                      <td className="px-2 py-2">{item.eventId}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </article>
      </section>

      <section className="mt-6 rounded-2xl border border-white/15 bg-slate-900/60 p-5 shadow-xl backdrop-blur sm:p-6">
        <h2 className="text-xl font-semibold text-white">Event History</h2>
        <div className="mt-4 overflow-x-auto">
          <table className="min-w-full text-left text-sm text-slate-200">
            <thead>
              <tr className="border-b border-white/15 text-slate-400">
                <th className="px-2 py-2 font-medium">Event ID</th>
                <th className="px-2 py-2 font-medium">Timestamp</th>
                <th className="px-2 py-2 font-medium">Amount</th>
                <th className="px-2 py-2 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {!stateData?.events?.length ? (
                <tr>
                  <td colSpan="4" className="px-2 py-3 text-slate-400">
                    No events found
                  </td>
                </tr>
              ) : (
                stateData.events.map((event) => (
                  <tr key={event._id || `${event.eventId}-${event.timestamp}`} className="border-b border-white/10">
                    <td className="px-2 py-2">{event.eventId}</td>
                    <td className="px-2 py-2">{new Date(event.timestamp).toLocaleString()}</td>
                    <td className="px-2 py-2">{event.amount}</td>
                    <td className="px-2 py-2">{event.status}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}
