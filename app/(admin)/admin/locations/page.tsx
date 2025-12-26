"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import AdminHeader from "@/components/AdminHeader";

interface Location {
  id: number;
  name: string;
  display_name: string;
  address?: string;
  postal_code?: string;
  city: string;
  district?: string;
  coordinates?: string;
  phone?: string;
  email?: string;
  description?: string;
  is_active: number;
  is_primary: number;
  created_at: string;
  updated_at: string;
}

export default function LocationsAdminPage() {
  const router = useRouter();
  const [locations, setLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    display_name: "",
    address: "",
    postal_code: "",
    city: "Praha",
    district: "",
    coordinates: "",
    phone: "",
    email: "",
    description: "",
    is_active: 1,
    is_primary: 0
  });

  useEffect(() => {
    fetchLocations();
  }, []);

  const fetchLocations = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/locations');
      const data = await response.json();
      if (data.success) {
        setLocations(data.locations);
      }
    } catch (error) {
      console.error('Error fetching locations:', error);
      alert('Chyba při načítání poboček');
    } finally {
      setLoading(false);
    }
  };

  const handleAddLocation = async () => {
    if (!formData.name || !formData.display_name || !formData.city) {
      alert('Vyplňte povinná pole: Název, Zobrazovaný název a Město');
      return;
    }

    try {
      const response = await fetch('/api/admin/locations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (data.success) {
        alert('Pobočka byla úspěšně přidána');
        setShowAddModal(false);
        resetForm();
        fetchLocations();
      } else {
        alert(data.error || 'Chyba při vytváření pobočky');
      }
    } catch (error) {
      console.error('Error adding location:', error);
      alert('Chyba při vytváření pobočky');
    }
  };

  const handleEditLocation = async () => {
    if (!selectedLocation || !formData.name || !formData.display_name || !formData.city) {
      alert('Vyplňte povinná pole');
      return;
    }

    try {
      const response = await fetch(`/api/admin/locations/${selectedLocation.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (data.success) {
        alert('Pobočka byla úspěšně aktualizována');
        setShowEditModal(false);
        setSelectedLocation(null);
        resetForm();
        fetchLocations();
      } else {
        alert(data.error || 'Chyba při aktualizaci pobočky');
      }
    } catch (error) {
      console.error('Error updating location:', error);
      alert('Chyba při aktualizaci pobočky');
    }
  };

  const handleDeleteLocation = async (id: number) => {
    if (!confirm('Opravdu chcete smazat tuto pobočku?')) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/locations/${id}`, {
        method: 'DELETE'
      });

      const data = await response.json();

      if (data.success) {
        alert('Pobočka byla úspěšně smazána');
        fetchLocations();
      } else {
        alert(data.error || 'Chyba při mazání pobočky');
      }
    } catch (error) {
      console.error('Error deleting location:', error);
      alert('Chyba při mazání pobočky');
    }
  };

  const openEditModal = (location: Location) => {
    setSelectedLocation(location);
    setFormData({
      name: location.name,
      display_name: location.display_name,
      address: location.address || "",
      postal_code: location.postal_code || "",
      city: location.city,
      district: location.district || "",
      coordinates: location.coordinates || "",
      phone: location.phone || "",
      email: location.email || "",
      description: location.description || "",
      is_active: location.is_active,
      is_primary: location.is_primary
    });
    setShowEditModal(true);
  };

  const resetForm = () => {
    setFormData({
      name: "",
      display_name: "",
      address: "",
      postal_code: "",
      city: "Praha",
      district: "",
      coordinates: "",
      phone: "",
      email: "",
      description: "",
      is_active: 1,
      is_primary: 0
    });
  };

  return (
    <>
      <AdminHeader title="Správa poboček" showBack={true} />

      <main style={{
        maxWidth: '1400px',
        margin: '0 auto',
        padding: '24px'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '24px'
        }}>
          <h1 style={{
            fontSize: '1.8rem',
            fontWeight: '700',
            color: '#fff'
          }}>Pobočky</h1>

          <button
            onClick={() => setShowAddModal(true)}
            style={{
              background: 'linear-gradient(135deg, #8b2942 0%, #5c1c2e 100%)',
              color: '#fff',
              border: 'none',
              borderRadius: '12px',
              padding: '12px 24px',
              fontSize: '0.95rem',
              fontWeight: '600',
              cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(139, 41, 66, 0.3)'
            }}
          >
            + Přidat pobočku
          </button>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px', color: '#9a8a8e' }}>
            Načítání...
          </div>
        ) : locations.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px', color: '#9a8a8e' }}>
            Žádné pobočky
          </div>
        ) : (
          <div style={{
            background: '#1a1418',
            border: '1px solid rgba(255,255,255,0.05)',
            borderRadius: '16px',
            overflow: 'hidden'
          }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: 'rgba(255,255,255,0.02)' }}>
                  <th style={{ padding: '16px', textAlign: 'left', color: '#9a8a8e', fontWeight: '600', fontSize: '0.9rem' }}>Název</th>
                  <th style={{ padding: '16px', textAlign: 'left', color: '#9a8a8e', fontWeight: '600', fontSize: '0.9rem' }}>Adresa</th>
                  <th style={{ padding: '16px', textAlign: 'left', color: '#9a8a8e', fontWeight: '600', fontSize: '0.9rem' }}>Město</th>
                  <th style={{ padding: '16px', textAlign: 'center', color: '#9a8a8e', fontWeight: '600', fontSize: '0.9rem' }}>Status</th>
                  <th style={{ padding: '16px', textAlign: 'center', color: '#9a8a8e', fontWeight: '600', fontSize: '0.9rem' }}>Akce</th>
                </tr>
              </thead>
              <tbody>
                {locations.map(location => (
                  <tr key={location.id} style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                    <td style={{ padding: '16px', color: '#fff' }}>
                      <div style={{ fontWeight: '600', marginBottom: '4px' }}>{location.display_name}</div>
                      <div style={{ fontSize: '0.85rem', color: '#9a8a8e' }}>{location.name}</div>
                      {location.is_primary === 1 && (
                        <span style={{
                          display: 'inline-block',
                          marginTop: '4px',
                          padding: '2px 8px',
                          background: 'rgba(139, 41, 66, 0.2)',
                          border: '1px solid #8b2942',
                          borderRadius: '6px',
                          fontSize: '0.75rem',
                          color: '#8b2942',
                          fontWeight: '600'
                        }}>HLAVNÍ</span>
                      )}
                    </td>
                    <td style={{ padding: '16px', color: '#fff' }}>
                      <div>{location.address || '-'}</div>
                      <div style={{ fontSize: '0.85rem', color: '#9a8a8e' }}>{location.district ? `${location.district}, ` : ''}{location.postal_code || ''}</div>
                    </td>
                    <td style={{ padding: '16px', color: '#fff' }}>{location.city}</td>
                    <td style={{ padding: '16px', textAlign: 'center' }}>
                      <span style={{
                        padding: '6px 12px',
                        borderRadius: '8px',
                        fontSize: '0.85rem',
                        fontWeight: '600',
                        background: location.is_active ? 'rgba(34, 197, 94, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                        color: location.is_active ? '#22c55e' : '#ef4444'
                      }}>
                        {location.is_active ? 'Aktivní' : 'Neaktivní'}
                      </span>
                    </td>
                    <td style={{ padding: '16px', textAlign: 'center' }}>
                      <button
                        onClick={() => openEditModal(location)}
                        style={{
                          background: 'rgba(59, 130, 246, 0.1)',
                          border: '1px solid rgba(59, 130, 246, 0.3)',
                          borderRadius: '8px',
                          padding: '6px 12px',
                          color: '#3b82f6',
                          fontSize: '0.85rem',
                          fontWeight: '600',
                          cursor: 'pointer',
                          marginRight: '8px'
                        }}
                      >
                        Upravit
                      </button>
                      <button
                        onClick={() => handleDeleteLocation(location.id)}
                        style={{
                          background: 'rgba(239, 68, 68, 0.1)',
                          border: '1px solid rgba(239, 68, 68, 0.3)',
                          borderRadius: '8px',
                          padding: '6px 12px',
                          color: '#ef4444',
                          fontSize: '0.85rem',
                          fontWeight: '600',
                          cursor: 'pointer'
                        }}
                      >
                        Smazat
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>

      {/* ADD MODAL */}
      {showAddModal && (
        <div className={`modal-overlay ${showAddModal ? 'show' : ''}`} onClick={(e) => {
          if (e.target === e.currentTarget) setShowAddModal(false);
        }}>
          <div className="modal" style={{ maxWidth: '600px' }}>
            <div className="modal-header">
              <span className="modal-title">Přidat pobočku</span>
              <button className="modal-close" onClick={() => setShowAddModal(false)}>×</button>
            </div>

            <div className="modal-body" style={{ maxHeight: '70vh', overflowY: 'auto' }}>
              <div style={{ display: 'grid', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', color: '#9a8a8e', fontSize: '0.9rem', fontWeight: '600' }}>
                    Interní název * (např. praha-2)
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="praha-2"
                    style={{
                      width: '100%',
                      padding: '12px',
                      background: '#0d0a0c',
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: '10px',
                      color: '#fff',
                      fontSize: '0.95rem'
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '8px', color: '#9a8a8e', fontSize: '0.9rem', fontWeight: '600' }}>
                    Zobrazovaný název * (např. Praha 2)
                  </label>
                  <input
                    type="text"
                    value={formData.display_name}
                    onChange={(e) => setFormData({ ...formData, display_name: e.target.value })}
                    placeholder="Praha 2"
                    style={{
                      width: '100%',
                      padding: '12px',
                      background: '#0d0a0c',
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: '10px',
                      color: '#fff',
                      fontSize: '0.95rem'
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '8px', color: '#9a8a8e', fontSize: '0.9rem', fontWeight: '600' }}>
                    Město *
                  </label>
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(3, 1fr)',
                    gap: '8px',
                    marginTop: '8px'
                  }}>
                    {['Praha', 'Brno', 'Ostrava', 'Plzeň', 'Liberec', 'Olomouc'].map(city => (
                      <div
                        key={city}
                        onClick={() => setFormData({ ...formData, city })}
                        style={{
                          padding: '12px 8px',
                          background: formData.city === city
                            ? 'linear-gradient(135deg, #8b2942 0%, #5c1c2e 100%)'
                            : '#1a1418',
                          border: formData.city === city
                            ? '2px solid #8b2942'
                            : '1px solid rgba(255,255,255,0.05)',
                          borderRadius: '12px',
                          cursor: 'pointer',
                          textAlign: 'center',
                          color: formData.city === city ? '#fff' : '#9a8a8e',
                          fontSize: '0.9rem',
                          fontWeight: formData.city === city ? '600' : '500',
                          transition: 'all 0.2s',
                          transform: formData.city === city ? 'scale(1.05)' : 'scale(1)'
                        }}
                      >
                        {city}
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '8px', color: '#9a8a8e', fontSize: '0.9rem', fontWeight: '600' }}>
                    Městská část / Obvod
                  </label>
                  <input
                    type="text"
                    value={formData.district}
                    onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                    placeholder="Vinohrady"
                    style={{
                      width: '100%',
                      padding: '12px',
                      background: '#0d0a0c',
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: '10px',
                      color: '#fff',
                      fontSize: '0.95rem'
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '8px', color: '#9a8a8e', fontSize: '0.9rem', fontWeight: '600' }}>
                    Adresa
                  </label>
                  <input
                    type="text"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    placeholder="Ulice a číslo popisné"
                    style={{
                      width: '100%',
                      padding: '12px',
                      background: '#0d0a0c',
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: '10px',
                      color: '#fff',
                      fontSize: '0.95rem'
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '8px', color: '#9a8a8e', fontSize: '0.9rem', fontWeight: '600' }}>
                    PSČ
                  </label>
                  <input
                    type="text"
                    value={formData.postal_code}
                    onChange={(e) => setFormData({ ...formData, postal_code: e.target.value })}
                    placeholder="120 00"
                    style={{
                      width: '100%',
                      padding: '12px',
                      background: '#0d0a0c',
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: '10px',
                      color: '#fff',
                      fontSize: '0.95rem'
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '8px', color: '#9a8a8e', fontSize: '0.9rem', fontWeight: '600' }}>
                    Popis
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Popis pobočky..."
                    rows={3}
                    style={{
                      width: '100%',
                      padding: '12px',
                      background: '#0d0a0c',
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: '10px',
                      color: '#fff',
                      fontSize: '0.95rem',
                      resize: 'vertical'
                    }}
                  />
                </div>

                <div style={{ display: 'flex', gap: '16px' }}>
                  <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={formData.is_active === 1}
                      onChange={(e) => setFormData({ ...formData, is_active: e.target.checked ? 1 : 0 })}
                      style={{ marginRight: '8px' }}
                    />
                    <span style={{ color: '#9a8a8e', fontSize: '0.9rem' }}>Aktivní</span>
                  </label>

                  <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={formData.is_primary === 1}
                      onChange={(e) => setFormData({ ...formData, is_primary: e.target.checked ? 1 : 0 })}
                      style={{ marginRight: '8px' }}
                    />
                    <span style={{ color: '#9a8a8e', fontSize: '0.9rem' }}>Hlavní pobočka</span>
                  </label>
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button
                className="modal-btn secondary"
                onClick={() => {
                  setShowAddModal(false);
                  resetForm();
                }}
              >
                Zrušit
              </button>
              <button
                className="modal-btn primary"
                onClick={handleAddLocation}
              >
                Přidat pobočku
              </button>
            </div>
          </div>
        </div>
      )}

      {/* EDIT MODAL - Same structure as ADD, but calls handleEditLocation */}
      {showEditModal && selectedLocation && (
        <div className={`modal-overlay ${showEditModal ? 'show' : ''}`} onClick={(e) => {
          if (e.target === e.currentTarget) {
            setShowEditModal(false);
            setSelectedLocation(null);
            resetForm();
          }
        }}>
          <div className="modal" style={{ maxWidth: '600px' }}>
            <div className="modal-header">
              <span className="modal-title">Upravit pobočku</span>
              <button className="modal-close" onClick={() => {
                setShowEditModal(false);
                setSelectedLocation(null);
                resetForm();
              }}>×</button>
            </div>

            <div className="modal-body" style={{ maxHeight: '70vh', overflowY: 'auto' }}>
              {/* Same form fields as ADD modal */}
              <div style={{ display: 'grid', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', color: '#9a8a8e', fontSize: '0.9rem', fontWeight: '600' }}>
                    Interní název *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '12px',
                      background: '#0d0a0c',
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: '10px',
                      color: '#fff',
                      fontSize: '0.95rem'
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '8px', color: '#9a8a8e', fontSize: '0.9rem', fontWeight: '600' }}>
                    Zobrazovaný název *
                  </label>
                  <input
                    type="text"
                    value={formData.display_name}
                    onChange={(e) => setFormData({ ...formData, display_name: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '12px',
                      background: '#0d0a0c',
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: '10px',
                      color: '#fff',
                      fontSize: '0.95rem'
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '8px', color: '#9a8a8e', fontSize: '0.9rem', fontWeight: '600' }}>
                    Město *
                  </label>
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(3, 1fr)',
                    gap: '8px',
                    marginTop: '8px'
                  }}>
                    {['Praha', 'Brno', 'Ostrava', 'Plzeň', 'Liberec', 'Olomouc'].map(city => (
                      <div
                        key={city}
                        onClick={() => setFormData({ ...formData, city })}
                        style={{
                          padding: '12px 8px',
                          background: formData.city === city
                            ? 'linear-gradient(135deg, #8b2942 0%, #5c1c2e 100%)'
                            : '#1a1418',
                          border: formData.city === city
                            ? '2px solid #8b2942'
                            : '1px solid rgba(255,255,255,0.05)',
                          borderRadius: '12px',
                          cursor: 'pointer',
                          textAlign: 'center',
                          color: formData.city === city ? '#fff' : '#9a8a8e',
                          fontSize: '0.9rem',
                          fontWeight: formData.city === city ? '600' : '500',
                          transition: 'all 0.2s',
                          transform: formData.city === city ? 'scale(1.05)' : 'scale(1)'
                        }}
                      >
                        {city}
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '8px', color: '#9a8a8e', fontSize: '0.9rem', fontWeight: '600' }}>
                    Městská část / Obvod
                  </label>
                  <input
                    type="text"
                    value={formData.district}
                    onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '12px',
                      background: '#0d0a0c',
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: '10px',
                      color: '#fff',
                      fontSize: '0.95rem'
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '8px', color: '#9a8a8e', fontSize: '0.9rem', fontWeight: '600' }}>
                    Adresa
                  </label>
                  <input
                    type="text"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '12px',
                      background: '#0d0a0c',
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: '10px',
                      color: '#fff',
                      fontSize: '0.95rem'
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '8px', color: '#9a8a8e', fontSize: '0.9rem', fontWeight: '600' }}>
                    PSČ
                  </label>
                  <input
                    type="text"
                    value={formData.postal_code}
                    onChange={(e) => setFormData({ ...formData, postal_code: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '12px',
                      background: '#0d0a0c',
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: '10px',
                      color: '#fff',
                      fontSize: '0.95rem'
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '8px', color: '#9a8a8e', fontSize: '0.9rem', fontWeight: '600' }}>
                    Telefon
                  </label>
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '12px',
                      background: '#0d0a0c',
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: '10px',
                      color: '#fff',
                      fontSize: '0.95rem'
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '8px', color: '#9a8a8e', fontSize: '0.9rem', fontWeight: '600' }}>
                    Email
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '12px',
                      background: '#0d0a0c',
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: '10px',
                      color: '#fff',
                      fontSize: '0.95rem'
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '8px', color: '#9a8a8e', fontSize: '0.9rem', fontWeight: '600' }}>
                    Popis
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={3}
                    style={{
                      width: '100%',
                      padding: '12px',
                      background: '#0d0a0c',
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: '10px',
                      color: '#fff',
                      fontSize: '0.95rem',
                      resize: 'vertical'
                    }}
                  />
                </div>

                <div style={{ display: 'flex', gap: '16px' }}>
                  <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={formData.is_active === 1}
                      onChange={(e) => setFormData({ ...formData, is_active: e.target.checked ? 1 : 0 })}
                      style={{ marginRight: '8px' }}
                    />
                    <span style={{ color: '#9a8a8e', fontSize: '0.9rem' }}>Aktivní</span>
                  </label>

                  <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={formData.is_primary === 1}
                      onChange={(e) => setFormData({ ...formData, is_primary: e.target.checked ? 1 : 0 })}
                      style={{ marginRight: '8px' }}
                    />
                    <span style={{ color: '#9a8a8e', fontSize: '0.9rem' }}>Hlavní pobočka</span>
                  </label>
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button
                className="modal-btn secondary"
                onClick={() => {
                  setShowEditModal(false);
                  setSelectedLocation(null);
                  resetForm();
                }}
              >
                Zrušit
              </button>
              <button
                className="modal-btn primary"
                onClick={handleEditLocation}
              >
                Uložit změny
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
