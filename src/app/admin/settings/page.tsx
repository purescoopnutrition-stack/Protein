'use client';

import { AdminGuard } from '@/components/admin/AdminGuard';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { useAdminSettings } from '@/hooks/use-admin';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Save } from 'lucide-react';
import { useState, useEffect } from 'react';
import { adminSaveSettings } from '@/lib/admin-api';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

export default function AdminSettings() {
  return <AdminGuard><AdminLayout title="Settings"><Content /></AdminLayout></AdminGuard>;
}

function Content() {
  const { data: settings, isLoading } = useAdminSettings();
  const qc = useQueryClient();
  const [saving, setSaving] = useState(false);
  const [values, setValues] = useState({
    whatsapp_number: '',
    shipping_charges: '',
    free_shipping_threshold: '',
    announcement_text: '',
  });

  useEffect(() => {
    if (settings) {
      setValues({
        whatsapp_number: settings.whatsapp_number || '918130297902',
        shipping_charges: settings.shipping_charges || '50',
        free_shipping_threshold: settings.free_shipping_threshold || '999',
        announcement_text: settings.announcement_text || '',
      });
    }
  }, [settings]);

  async function handleSave() {
    setSaving(true);
    try {
      await adminSaveSettings(values);
      toast.success('Settings saved!');
      qc.invalidateQueries({ queryKey: ['admin-settings'] });
      qc.invalidateQueries({ queryKey: ['settings'] });
    } catch {
      toast.error('Failed to save settings');
    } finally {
      setSaving(false);
    }
  }

  if (isLoading) {
    return <div className="flex items-center justify-center py-20"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div>;
  }

  return (
    <div className="max-w-2xl space-y-8">
      {/* WhatsApp */}
      <div className="bg-[#1A1A1A] rounded-2xl p-6 border border-white/5 space-y-4">
        <h3 className="text-lg font-bold">WhatsApp Settings</h3>
        <div>
          <label className="text-sm text-white/50 mb-1 block">WhatsApp Number (with country code, e.g., 918130297902)</label>
          <Input
            value={values.whatsapp_number}
            onChange={(e) => setValues((v) => ({ ...v, whatsapp_number: e.target.value }))}
            placeholder="918130297902"
            className="bg-white/5 border-white/10 text-white"
          />
        </div>
      </div>

      {/* Shipping */}
      <div className="bg-[#1A1A1A] rounded-2xl p-6 border border-white/5 space-y-4">
        <h3 className="text-lg font-bold">Shipping Rules</h3>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="text-sm text-white/50 mb-1 block">Shipping Charges (₹)</label>
            <Input
              value={values.shipping_charges}
              onChange={(e) => setValues((v) => ({ ...v, shipping_charges: e.target.value }))}
              type="number"
              className="bg-white/5 border-white/10 text-white"
            />
          </div>
          <div>
            <label className="text-sm text-white/50 mb-1 block">Free Shipping Threshold (₹)</label>
            <Input
              value={values.free_shipping_threshold}
              onChange={(e) => setValues((v) => ({ ...v, free_shipping_threshold: e.target.value }))}
              type="number"
              className="bg-white/5 border-white/10 text-white"
            />
          </div>
        </div>
      </div>

      {/* Announcement */}
      <div className="bg-[#1A1A1A] rounded-2xl p-6 border border-white/5 space-y-4">
        <h3 className="text-lg font-bold">Announcement Bar</h3>
        <div>
          <label className="text-sm text-white/50 mb-1 block">Announcement Text</label>
          <Textarea
            value={values.announcement_text}
            onChange={(e) => setValues((v) => ({ ...v, announcement_text: e.target.value }))}
            className="bg-white/5 border-white/10 text-white min-h-[80px]"
            placeholder="🔥 Free shipping on orders above ₹999!"
          />
        </div>
      </div>

      <Button onClick={handleSave} disabled={saving} className="bg-primary text-white rounded-xl px-8">
        {saving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
        Save Settings
      </Button>
    </div>
  );
}

