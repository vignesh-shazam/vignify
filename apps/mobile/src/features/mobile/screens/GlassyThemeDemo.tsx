import React, { useState } from 'react';
import { Star, Heart, Settings, Bell, User, Plus, Search, Menu, X } from 'lucide-react';

export function GlassyThemeDemo() {
  const [toggleState, setToggleState] = useState({
    wifi: true,
    bluetooth: false,
    notifications: true,
  });

  const [sliderValue, setSliderValue] = useState(50);

  return (
    <div className="glass-background" style={{ minHeight: '100vh', padding: '20px' }}>
      <div style={{ maxWidth: '400px', margin: '0 auto' }}>
        {/* Header */}
        <div className="glass-card" style={{ padding: '20px', marginBottom: '20px' }}>
          <h1 style={{ color: '#ffffff', fontSize: '24px', fontWeight: 'bold', margin: 0 }}>
            Glassy Theme Demo
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '14px', marginTop: '8px' }}>
            Premium glassmorphism UI components
          </p>
        </div>

        {/* Glass Cards */}
        <h2 style={{ color: '#ffffff', fontSize: '18px', marginBottom: '12px' }}>Glass Cards</h2>
        <div className="glass-card" style={{ padding: '16px', marginBottom: '12px' }}>
          <h3 style={{ color: '#ffffff', fontSize: '16px', margin: '0 0 8px 0' }}>
            Basic Card
          </h3>
          <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '14px', margin: 0 }}>
            This is a glass card with blur effect
          </p>
        </div>

        <div className="glass-card" style={{ padding: '16px', marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ 
              width: '48px', 
              height: '48px', 
              borderRadius: '50%', 
              background: 'linear-gradient(135deg, #8B2CFF, #176DFF)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <User size={24} color="white" />
            </div>
            <div>
              <h3 style={{ color: '#ffffff', fontSize: '16px', margin: '0 0 4px 0' }}>
                User Profile
              </h3>
              <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '12px', margin: 0 }}>
                Premium member
              </p>
            </div>
          </div>
        </div>

        {/* Glass Buttons */}
        <h2 style={{ color: '#ffffff', fontSize: '18px', marginBottom: '12px' }}>Glass Buttons</h2>
        <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', flexWrap: 'wrap' }}>
          <button className="glass-button" style={{ padding: '12px 24px' }}>
            Primary
          </button>
          <button 
            className="glass-button" 
            style={{ 
              padding: '12px 24px',
              background: 'rgba(23, 109, 255, 0.3)'
            }}
          >
            Secondary
          </button>
          <button 
            className="glass-button" 
            style={{ 
              padding: '12px 24px',
              background: 'rgba(240, 0, 232, 0.3)'
            }}
          >
            Accent
          </button>
        </div>

        {/* Glass Icons */}
        <h2 style={{ color: '#ffffff', fontSize: '18px', marginBottom: '12px' }}>Glass Icons</h2>
        <div style={{ display: 'flex', gap: '12px', marginBottom: '20px', flexWrap: 'wrap' }}>
          <div className="glass-icon" style={{ padding: '16px' }}>
            <Star size={24} color="white" />
          </div>
          <div className="glass-icon" style={{ padding: '16px' }}>
            <Heart size={24} color="white" />
          </div>
          <div className="glass-icon" style={{ padding: '16px' }}>
            <Settings size={24} color="white" />
          </div>
          <div className="glass-icon" style={{ padding: '16px' }}>
            <Bell size={24} color="white" />
          </div>
          <div className="glass-icon" style={{ padding: '16px' }}>
            <Menu size={24} color="white" />
          </div>
        </div>

        {/* Glass Input */}
        <h2 style={{ color: '#ffffff', fontSize: '18px', marginBottom: '12px' }}>Glass Input</h2>
        <div className="glass-card" style={{ padding: '16px', marginBottom: '20px' }}>
          <input 
            className="glass-input" 
            type="text" 
            placeholder="Search..."
            style={{ width: '100%', marginBottom: '12px' }}
          />
          <input 
            className="glass-input" 
            type="text" 
            placeholder="Email address"
            style={{ width: '100%' }}
          />
        </div>

        {/* Glass Slider */}
        <h2 style={{ color: '#ffffff', fontSize: '18px', marginBottom: '12px' }}>Glass Slider</h2>
        <div className="glass-card" style={{ padding: '16px', marginBottom: '20px' }}>
          <label style={{ color: '#ffffff', fontSize: '14px', marginBottom: '8px', display: 'block' }}>
            Brightness: {sliderValue}%
          </label>
          <input 
            type="range" 
            className="glass-slider"
            value={sliderValue}
            onChange={(e) => setSliderValue(Number(e.target.value))}
            style={{ width: '100%' }}
          />
        </div>

        {/* Glass Toggles */}
        <h2 style={{ color: '#ffffff', fontSize: '18px', marginBottom: '12px' }}>Glass Toggles</h2>
        <div className="glass-card" style={{ padding: '16px', marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
            <span style={{ color: '#ffffff', fontSize: '14px' }}>Wi-Fi</span>
            <div 
              className={`glass-toggle ${toggleState.wifi ? 'active' : ''}`}
              onClick={() => setToggleState({ ...toggleState, wifi: !toggleState.wifi })}
              style={{ width: '50px', height: '28px' }}
            />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
            <span style={{ color: '#ffffff', fontSize: '14px' }}>Bluetooth</span>
            <div 
              className={`glass-toggle ${toggleState.bluetooth ? 'active' : ''}`}
              onClick={() => setToggleState({ ...toggleState, bluetooth: !toggleState.bluetooth })}
              style={{ width: '50px', height: '28px' }}
            />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ color: '#ffffff', fontSize: '14px' }}>Notifications</span>
            <div 
              className={`glass-toggle ${toggleState.notifications ? 'active' : ''}`}
              onClick={() => setToggleState({ ...toggleState, notifications: !toggleState.notifications })}
              style={{ width: '50px', height: '28px' }}
            />
          </div>
        </div>

        {/* Glass Notification */}
        <h2 style={{ color: '#ffffff', fontSize: '18px', marginBottom: '12px' }}>Glass Notification</h2>
        <div className="glass-notification" style={{ marginBottom: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ 
              width: '40px', 
              height: '40px', 
              borderRadius: '10px', 
              background: 'linear-gradient(135deg, #8B2CFF, #176DFF)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Bell size={20} color="white" />
            </div>
            <div style={{ flex: 1 }}>
              <h4 style={{ color: '#ffffff', fontSize: '14px', margin: '0 0 4px 0' }}>
                New Message
              </h4>
              <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '12px', margin: 0 }}>
                You have a new notification
              </p>
            </div>
            <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '12px' }}>
              2m ago
            </span>
          </div>
        </div>

        {/* Glass Progress Bar */}
        <h2 style={{ color: '#ffffff', fontSize: '18px', marginBottom: '12px' }}>Glass Progress</h2>
        <div className="glass-card" style={{ padding: '16px', marginBottom: '20px' }}>
          <div style={{ marginBottom: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span style={{ color: '#ffffff', fontSize: '14px' }}>Download</span>
              <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: '14px' }}>75%</span>
            </div>
            <div className="glass-progress" style={{ height: '8px' }}>
              <div className="glass-progress-bar" style={{ width: '75%' }} />
            </div>
          </div>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span style={{ color: '#ffffff', fontSize: '14px' }}>Upload</span>
              <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: '14px' }}>45%</span>
            </div>
            <div className="glass-progress" style={{ height: '8px' }}>
              <div className="glass-progress-bar" style={{ width: '45%' }} />
            </div>
          </div>
        </div>

        {/* Glass Badges */}
        <h2 style={{ color: '#ffffff', fontSize: '18px', marginBottom: '12px' }}>Glass Badges</h2>
        <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', flexWrap: 'wrap' }}>
          <span className="glass-badge">New</span>
          <span className="glass-badge" style={{ background: '#176DFF' }}>Pro</span>
          <span className="glass-badge" style={{ background: '#F000E8' }}>Hot</span>
          <span className="glass-badge" style={{ background: '#22d3ee' }}>Beta</span>
        </div>

        {/* Glass Chips */}
        <h2 style={{ color: '#ffffff', fontSize: '18px', marginBottom: '12px' }}>Glass Chips</h2>
        <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', flexWrap: 'wrap' }}>
          <span className="glass-chip active">All</span>
          <span className="glass-chip">Wallpapers</span>
          <span className="glass-chip">Themes</span>
          <span className="glass-chip">Icons</span>
          <span className="glass-chip">Ringtones</span>
        </div>

        {/* Glass Avatar */}
        <h2 style={{ color: '#ffffff', fontSize: '18px', marginBottom: '12px' }}>Glass Avatar</h2>
        <div style={{ display: 'flex', gap: '12px', marginBottom: '20px' }}>
          <div className="glass-avatar" style={{ width: '40px', height: '40px', fontSize: '14px' }}>
            A
          </div>
          <div className="glass-avatar" style={{ width: '48px', height: '48px', fontSize: '18px' }}>
            B
          </div>
          <div className="glass-avatar" style={{ width: '56px', height: '56px', fontSize: '22px' }}>
            C
          </div>
        </div>

        {/* Glass Divider */}
        <div className="glass-divider" style={{ marginBottom: '20px' }} />

        {/* Footer */}
        <div className="glass-card" style={{ padding: '16px', textAlign: 'center' }}>
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '12px', margin: 0 }}>
            Glassy Theme Demo © 2024 Vignify
          </p>
        </div>
      </div>
    </div>
  );
}
