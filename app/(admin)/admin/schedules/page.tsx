"use client";

import { useState, useEffect } from "react";
import AdminHeader from "@/components/AdminHeader";
import { useLocations } from "@/lib/hooks/useLocations";

interface Schedule {
  id: number;
  day_of_week: number;
  start_time: string;
  end_time: string;
}

interface GirlSchedule {
  girl_id: number;
  girl_name: string;
  girl_color: string;
  schedules: Schedule[];
}

interface Girl {
  id: number;
  name: string;
  color: string;
}

const DAYS = ["Pondělí", "Úterý", "Středa", "Čtvrtek", "Pátek", "Sobota", "Neděle"];

export default function SchedulesPage() {
  const { locationNames, primaryLocation } = useLocations();
  const [girls, setGirls] = useState<Girl[]>([]);
  const [schedules, setSchedules] = useState<GirlSchedule[]>([]);
  const [selectedGirl, setSelectedGirl] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);

  // Form state
  const [formGirlId, setFormGirlId] = useState<number>(0);
  const [selectedDays, setSelectedDays] = useState<number[]>([]);
  const [dayTimes, setDayTimes] = useState<Record<number, { start: string; end: string }>>({});
  const [formLocation, setFormLocation] = useState<string>(primaryLocation?.display_name || "Praha");

  // Fetch girls and schedules on mount
  useEffect(() => {
    fetchGirls();
    fetchSchedules();
  }, []);

  const fetchGirls = async () => {
    try {
      const response = await fetch('/api/girls?status=active');
      const data = await response.json();
      if (data.success && Array.isArray(data.girls)) {
        setGirls(data.girls);
      }
    } catch (error) {
      console.error('Error fetching girls:', error);
    }
  };

  const fetchSchedules = async () => {
    try {
      const response = await fetch('/api/admin/schedules');
      const data = await response.json();
      if (data.success) {
        setSchedules(data.schedules);
      }
    } catch (error) {
      console.error('Error fetching schedules:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleDay = (dayIndex: number) => {
    setSelectedDays(prev => {
      if (prev.includes(dayIndex)) {
        // Remove day and its times
        setDayTimes(times => {
          const newTimes = { ...times };
          delete newTimes[dayIndex];
          return newTimes;
        });
        return prev.filter(d => d !== dayIndex);
      } else {
        // Add day with default time (celodenní)
        setDayTimes(times => ({
          ...times,
          [dayIndex]: { start: "10:00", end: "22:00" }
        }));
        return [...prev, dayIndex].sort();
      }
    });
  };

  const setDayTimePreset = (dayIndex: number, preset: 'morning' | 'afternoon' | 'fullday') => {
    const presets = {
      morning: { start: "10:00", end: "16:00" },
      afternoon: { start: "16:30", end: "22:30" },
      fullday: { start: "10:00", end: "22:00" }
    };
    setDayTimes(times => ({
      ...times,
      [dayIndex]: presets[preset]
    }));
  };

  const handleAddSchedule = async () => {
    if (formGirlId === 0) {
      alert('Vyberte dívku');
      return;
    }

    if (selectedDays.length === 0) {
      alert('Vyberte alespoň jeden den');
      return;
    }

    try {
      // Create schedule for each selected day with its specific time
      const promises = selectedDays.map(dayIndex => {
        const times = dayTimes[dayIndex] || { start: "10:00", end: "22:00" };
        return fetch('/api/admin/schedules', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            girl_id: formGirlId,
            day_of_week: dayIndex,
            start_time: times.start,
            end_time: times.end,
            location: formLocation
          })
        });
      });

      const responses = await Promise.all(promises);
      const successCount = responses.filter(r => r.ok).length;
      const totalCount = responses.length;

      // Always refresh schedules and close modal if at least one succeeded
      if (successCount > 0) {
        setShowAddModal(false);
        // Reset filter to show all girls
        setSelectedGirl(null);
        fetchSchedules();
        // Reset form
        setFormGirlId(0);
        setSelectedDays([]);
        setDayTimes({});
        setFormLocation(primaryLocation?.display_name || "Praha");

        // Show appropriate message
        if (successCount === totalCount) {
          alert(`✅ Všechny rozvrhy (${successCount}) byly úspěšně vytvořeny`);
        } else {
          alert(`⚠️ ${successCount} z ${totalCount} rozvrhů bylo vytvořeno. ${totalCount - successCount} se nepodařilo.`);
        }
      } else {
        alert('❌ Nepodařilo se vytvořit žádný rozvrh');
      }
    } catch (error) {
      alert('Chyba při vytváření rozvrhů');
    }
  };

  const handleDeleteSchedule = async (scheduleId: number) => {
    if (!confirm('Opravdu smazat tento rozvrh?')) return;

    try {
      const response = await fetch(`/api/admin/schedules?id=${scheduleId}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        fetchSchedules();
      } else {
        alert('Chyba při mazání rozvrhu');
      }
    } catch (error) {
      console.error('Error deleting schedule:', error);
      alert('Chyba při mazání rozvrhu');
    }
  };

  const filteredSchedules = selectedGirl
    ? schedules.filter(s => s.girl_id === selectedGirl)
    : schedules;

  return (
    <>
      <AdminHeader title="Správa rozvrhů" showBack={true} />

      <main className="app-content">

        {/* HEADER ACTIONS */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '20px'
        }}>
          <div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '4px' }}>
              Pracovní doba dívek
            </h2>
            <p style={{ fontSize: '0.85rem', color: '#9a8a8e' }}>
              Definujte, kdy jsou dívky k dispozici pro rezervace
            </p>
          </div>
          <button
            type="button"
            onClick={() => setShowAddModal(true)}
            style={{
              padding: '12px 20px',
              background: 'linear-gradient(135deg, #8b2942 0%, #5c1c2e 100%)',
              border: 'none',
              borderRadius: '12px',
              color: 'white',
              fontSize: '0.9rem',
              fontWeight: '600',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="12" y1="5" x2="12" y2="19"/>
              <line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
            Přidat rozvrh
          </button>
        </div>

        {/* FILTER BY GIRL - MODERN DESIGN */}
        <div style={{
          background: '#231a1e',
          borderRadius: '16px',
          padding: '16px',
          marginBottom: '24px'
        }}>
          <div style={{
            fontSize: '0.75rem',
            color: '#9a8a8e',
            marginBottom: '12px',
            textTransform: 'uppercase',
            fontWeight: '600',
            letterSpacing: '0.5px'
          }}>
            Filtr podle dívky
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))',
            gap: '10px'
          }}>
            <button
              onClick={() => setSelectedGirl(null)}
              style={{
                padding: '10px 14px',
                background: selectedGirl === null
                  ? 'linear-gradient(135deg, #8b2942 0%, #5c1c2e 100%)'
                  : '#1a1418',
                border: selectedGirl === null ? 'none' : '1px solid rgba(255,255,255,0.05)',
                borderRadius: '12px',
                color: 'white',
                fontSize: '0.85rem',
                fontWeight: selectedGirl === null ? '600' : '500',
                cursor: 'pointer',
                transition: 'all 0.2s',
                textAlign: 'left'
              }}
            >
              Všechny ({girls.length})
            </button>
            {girls.map(girl => (
              <button
                key={girl.id}
                onClick={() => setSelectedGirl(girl.id)}
                style={{
                  padding: '10px 14px',
                  background: selectedGirl === girl.id
                    ? 'linear-gradient(135deg, #8b2942 0%, #5c1c2e 100%)'
                    : '#1a1418',
                  border: selectedGirl === girl.id ? 'none' : '1px solid rgba(255,255,255,0.05)',
                  borderRadius: '12px',
                  color: 'white',
                  fontSize: '0.85rem',
                  fontWeight: selectedGirl === girl.id ? '600' : '500',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  transition: 'all 0.2s',
                  textAlign: 'left'
                }}
              >
                <div style={{
                  width: '24px',
                  height: '24px',
                  borderRadius: '8px',
                  background: girl.color || '#5c1c2e',
                  flexShrink: 0,
                  boxShadow: selectedGirl === girl.id
                    ? `0 0 12px ${girl.color}40`
                    : 'none'
                }} />
                <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {girl.name}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* SCHEDULES LIST */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px', color: '#9a8a8e' }}>
            Načítání...
          </div>
        ) : filteredSchedules.length === 0 ? (
          <div style={{
            background: '#231a1e',
            borderRadius: '16px',
            padding: '40px',
            textAlign: 'center',
            color: '#9a8a8e'
          }}>
            {selectedGirl ? 'Žádné rozvrhy pro tuto dívku' : 'Žádné rozvrhy'}
          </div>
        ) : (
          filteredSchedules.map((girlSchedule) => (
            <div key={girlSchedule.girl_id} style={{
              background: '#231a1e',
              borderRadius: '16px',
              padding: '20px',
              marginBottom: '16px'
            }}>
              {/* Girl Header */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                marginBottom: '16px',
                paddingBottom: '16px',
                borderBottom: '1px solid rgba(255,255,255,0.05)'
              }}>
                <div style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  background: girlSchedule.girl_color || '#5c1c2e',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.2rem'
                }}>👩</div>
                <div>
                  <div style={{ fontSize: '1.1rem', fontWeight: '600' }}>
                    {girlSchedule.girl_name}
                  </div>
                  <div style={{ fontSize: '0.8rem', color: '#9a8a8e' }}>
                    {girlSchedule.schedules.length} rozvrh{girlSchedule.schedules.length !== 1 ? 'ů' : ''}
                  </div>
                </div>
              </div>

              {/* Schedules */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {girlSchedule.schedules.map((schedule) => (
                  <div key={schedule.id} style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '12px 14px',
                    background: '#1a1418',
                    borderRadius: '10px'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                      <div style={{
                        minWidth: '90px',
                        fontSize: '0.9rem',
                        fontWeight: '600'
                      }}>
                        {DAYS[schedule.day_of_week]}
                      </div>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        fontSize: '0.85rem',
                        color: '#ccc'
                      }}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9a8a8e" strokeWidth="2">
                          <circle cx="12" cy="12" r="10"/>
                          <polyline points="12 6 12 12 16 14"/>
                        </svg>
                        {schedule.start_time.substring(0, 5)} — {schedule.end_time.substring(0, 5)}
                      </div>
                    </div>
                    <button
                      onClick={() => handleDeleteSchedule(schedule.id)}
                      style={{
                        padding: '6px 12px',
                        background: 'rgba(239, 68, 68, 0.1)',
                        border: '1px solid rgba(239, 68, 68, 0.2)',
                        borderRadius: '8px',
                        color: '#ef4444',
                        fontSize: '0.8rem',
                        cursor: 'pointer'
                      }}
                    >
                      Smazat
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}

      </main>

      {/* ADD MODAL */}
      {showAddModal && (
        <div className={`modal-overlay ${showAddModal ? 'show' : ''}`} onClick={(e) => {
          if (e.target === e.currentTarget) {
            setShowAddModal(false);
          }
        }}>
          <div className="modal">
            <div className="modal-header">
              <span className="modal-title">Přidat rozvrh</span>
              <button className="modal-close" onClick={() => setShowAddModal(false)}>×</button>
            </div>
            <div className="modal-body">
              {/* Girl Selection - Compact */}
              <div className="form-group">
                <label className="form-label">Vyberte dívku</label>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(4, 1fr)',
                  gap: '8px',
                  marginTop: '8px'
                }}>
                  {girls.map(girl => (
                    <button
                      key={girl.id}
                      type="button"
                      onClick={() => setFormGirlId(girl.id)}
                      style={{
                        padding: '8px 10px',
                        background: formGirlId === girl.id
                          ? 'linear-gradient(135deg, #8b2942 0%, #5c1c2e 100%)'
                          : '#1a1418',
                        border: formGirlId === girl.id
                          ? '2px solid #8b2942'
                          : '1px solid rgba(255,255,255,0.05)',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        fontSize: '0.8rem',
                        fontWeight: formGirlId === girl.id ? '600' : '500',
                        color: formGirlId === girl.id ? '#fff' : '#ccc'
                      }}
                    >
                      <div style={{
                        width: '8px',
                        height: '8px',
                        borderRadius: '50%',
                        background: girl.color || '#8b2942',
                        flexShrink: 0
                      }} />
                      {girl.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Location Selection - Modern Buttons */}
              <div className="form-group">
                <label className="form-label">Pobočka</label>
                <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
                  {(locationNames.length > 0 ? locationNames : ['Praha']).map(location => (
                    <button
                      key={location}
                      type="button"
                      onClick={() => setFormLocation(location)}
                      style={{
                        flex: 1,
                        padding: '10px',
                        background: formLocation === location
                          ? 'linear-gradient(135deg, #8b2942 0%, #5c1c2e 100%)'
                          : '#1a1418',
                        border: formLocation === location
                          ? '2px solid #8b2942'
                          : '1px solid rgba(255,255,255,0.05)',
                        borderRadius: '10px',
                        color: formLocation === location ? '#fff' : '#9a8a8e',
                        fontSize: '0.9rem',
                        fontWeight: formLocation === location ? '600' : '500',
                        cursor: 'pointer',
                        transition: 'all 0.2s'
                      }}
                    >
                      {location}
                    </button>
                  ))}
                </div>
              </div>

              {/* Day Selection - Multi-select with Checkboxes */}
              <div className="form-group">
                <label className="form-label">
                  Vyberte dny (můžete vybrat více)
                  {selectedDays.length > 0 && (
                    <span style={{ marginLeft: '8px', color: '#22c55e', fontSize: '0.85rem' }}>
                      • {selectedDays.length} {selectedDays.length === 1 ? 'den' : selectedDays.length < 5 ? 'dny' : 'dnů'}
                    </span>
                  )}
                </label>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(4, 1fr)',
                  gap: '8px',
                  marginTop: '8px'
                }}>
                  {DAYS.map((day, index) => {
                    const isSelected = selectedDays.includes(index);
                    return (
                      <div
                        key={index}
                        onClick={() => toggleDay(index)}
                        style={{
                          padding: '10px 8px',
                          background: isSelected
                            ? 'linear-gradient(135deg, #8b2942 0%, #5c1c2e 100%)'
                            : '#1a1418',
                          border: isSelected
                            ? '2px solid #8b2942'
                            : '1px solid rgba(255,255,255,0.05)',
                          borderRadius: '10px',
                          color: isSelected ? '#fff' : '#9a8a8e',
                          fontSize: '0.85rem',
                          fontWeight: isSelected ? '600' : '500',
                          cursor: 'pointer',
                          textAlign: 'center',
                          transition: 'all 0.2s',
                          transform: isSelected ? 'scale(1.05)' : 'scale(1)',
                          position: 'relative'
                        }}
                      >
                        {isSelected && (
                          <div style={{
                            position: 'absolute',
                            top: '4px',
                            right: '4px',
                            width: '16px',
                            height: '16px',
                            background: '#22c55e',
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '10px'
                          }}>
                            ✓
                          </div>
                        )}
                        {day.substring(0, 3)}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Time Settings for Each Selected Day */}
              {selectedDays.length > 0 && (
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '16px',
                  marginTop: '16px'
                }}>
                  {selectedDays.map(dayIndex => {
                    const times = dayTimes[dayIndex] || { start: "10:00", end: "22:00" };
                    const isMorning = times.start === "10:00" && times.end === "16:00";
                    const isAfternoon = times.start === "16:30" && times.end === "22:30";
                    const isFullday = times.start === "10:00" && times.end === "22:00";

                    return (
                      <div key={dayIndex} style={{
                        background: '#1a1418',
                        borderRadius: '12px',
                        padding: '16px',
                        border: '1px solid rgba(255,255,255,0.05)'
                      }}>
                        {/* Day Header */}
                        <div style={{
                          fontSize: '0.95rem',
                          fontWeight: '600',
                          marginBottom: '12px',
                          color: '#fff'
                        }}>
                          {DAYS[dayIndex]}
                        </div>

                        {/* Quick Time Presets */}
                        <div style={{ display: 'flex', gap: '6px', marginBottom: '12px' }}>
                          <button
                            type="button"
                            onClick={() => setDayTimePreset(dayIndex, 'morning')}
                            style={{
                              flex: 1,
                              padding: '8px 6px',
                              background: isMorning
                                ? 'linear-gradient(135deg, #8b2942 0%, #5c1c2e 100%)'
                                : '#231a1e',
                              border: isMorning
                                ? '2px solid #8b2942'
                                : '1px solid rgba(255,255,255,0.05)',
                              borderRadius: '8px',
                              color: '#fff',
                              fontSize: '0.75rem',
                              fontWeight: '600',
                              cursor: 'pointer',
                              transition: 'all 0.2s'
                            }}
                          >
                            Ranní
                            <div style={{ fontSize: '0.7rem', color: '#9a8a8e', marginTop: '2px' }}>
                              10:00-16:00
                            </div>
                          </button>
                          <button
                            type="button"
                            onClick={() => setDayTimePreset(dayIndex, 'afternoon')}
                            style={{
                              flex: 1,
                              padding: '8px 6px',
                              background: isAfternoon
                                ? 'linear-gradient(135deg, #8b2942 0%, #5c1c2e 100%)'
                                : '#231a1e',
                              border: isAfternoon
                                ? '2px solid #8b2942'
                                : '1px solid rgba(255,255,255,0.05)',
                              borderRadius: '8px',
                              color: '#fff',
                              fontSize: '0.75rem',
                              fontWeight: '600',
                              cursor: 'pointer',
                              transition: 'all 0.2s'
                            }}
                          >
                            Odpolední
                            <div style={{ fontSize: '0.7rem', color: '#9a8a8e', marginTop: '2px' }}>
                              16:30-22:30
                            </div>
                          </button>
                          <button
                            type="button"
                            onClick={() => setDayTimePreset(dayIndex, 'fullday')}
                            style={{
                              flex: 1,
                              padding: '8px 6px',
                              background: isFullday
                                ? 'linear-gradient(135deg, #8b2942 0%, #5c1c2e 100%)'
                                : '#231a1e',
                              border: isFullday
                                ? '2px solid #8b2942'
                                : '1px solid rgba(255,255,255,0.05)',
                              borderRadius: '8px',
                              color: '#fff',
                              fontSize: '0.75rem',
                              fontWeight: '600',
                              cursor: 'pointer',
                              transition: 'all 0.2s'
                            }}
                          >
                            Celodenní
                            <div style={{ fontSize: '0.7rem', color: '#9a8a8e', marginTop: '2px' }}>
                              10:00-22:00
                            </div>
                          </button>
                        </div>

                        {/* Manual Time Inputs */}
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                          <div>
                            <label style={{ fontSize: '0.7rem', color: '#9a8a8e', marginBottom: '4px', display: 'block' }}>
                              Od
                            </label>
                            <input
                              type="time"
                              className="form-input"
                              value={times.start}
                              onChange={(e) => setDayTimes(prev => ({
                                ...prev,
                                [dayIndex]: { ...prev[dayIndex], start: e.target.value }
                              }))}
                              style={{
                                fontSize: '0.85rem',
                                fontWeight: '600',
                                padding: '8px'
                              }}
                            />
                          </div>
                          <div>
                            <label style={{ fontSize: '0.7rem', color: '#9a8a8e', marginBottom: '4px', display: 'block' }}>
                              Do
                            </label>
                            <input
                              type="time"
                              className="form-input"
                              value={times.end}
                              onChange={(e) => setDayTimes(prev => ({
                                ...prev,
                                [dayIndex]: { ...prev[dayIndex], end: e.target.value }
                              }))}
                              style={{
                                fontSize: '0.85rem',
                                fontWeight: '600',
                                padding: '8px'
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
            <div className="modal-footer">
              <button className="modal-btn secondary" onClick={() => setShowAddModal(false)}>
                Zrušit
              </button>
              <button className="modal-btn primary" onClick={handleAddSchedule}>
                Přidat
              </button>
            </div>
          </div>
        </div>
      )}

    </>
  );
}
