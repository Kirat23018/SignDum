import React, { useState, useEffect } from 'react';
import { getSubscriptionStatus, upgradeSubscription, resetFreeTrial } from '../utils/subscriptionManager';

export default function Pricing() {
  const [subStatus, setSubStatus] = useState(getSubscriptionStatus());
  const [billingCycle, setBillingCycle] = useState('monthly'); // 'monthly' | 'yearly'
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    setSubStatus(getSubscriptionStatus());
  }, []);

  const handleUpgrade = (planType) => {
    const updated = upgradeSubscription(planType);
    setSubStatus(updated);
    setSuccessMessage(`🎉 Successfully upgraded to ${updated.plan}! Unlimited access activated.`);
    setTimeout(() => setSuccessMessage(''), 4000);
  };

  const handleResetTrial = () => {
    const updated = resetFreeTrial();
    setSubStatus(updated);
    setSuccessMessage('🔄 Free Trial reset to 3 Days with 50 credits for testing!');
    setTimeout(() => setSuccessMessage(''), 4000);
  };

  return (
    <div style={{ padding: '40px 20px', backgroundColor: '#f8fafc', minHeight: 'calc(100vh - 45px)', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      <div style={{ maxWidth: '1050px', margin: '0 auto' }}>
        
        {/* Header Title */}
        <div style={{ textAlign: 'center', marginBottom: '36px' }}>
          <span style={{ backgroundColor: '#ede9fe', color: '#6d28d9', padding: '6px 16px', borderRadius: '20px', fontSize: '13.5px', fontWeight: '800', display: 'inline-block', marginBottom: '12px' }}>
            💎 Flexible & Affordable Pricing
          </span>
          <h1 style={{ color: '#0f172a', fontSize: '36px', fontWeight: '800', margin: '0 0 10px 0', letterSpacing: '-0.5px' }}>
            Choose the Perfect Plan for SignVerse
          </h1>
          <p style={{ color: '#64748b', fontSize: '16px', maxWidth: '620px', margin: '0 auto', lineHeight: '1.6' }}>
            Start with our <strong>3-Day Free Trial</strong>, then unlock unlimited 3D avatar translations, real-time camera sign recognition, and AI capabilities.
          </p>

          {/* Current Status Notification */}
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '10px',
            backgroundColor: '#ffffff', padding: '10px 20px', borderRadius: '30px',
            border: '1.5px solid #e2e8f0', marginTop: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
          }}>
            <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: subStatus.isPaidPlan ? '#10b981' : subStatus.isTrialActive ? '#f59e0b' : '#ef4444' }} />
            <span style={{ fontSize: '13.5px', fontWeight: '700', color: '#1e293b' }}>
              Current Status: <span style={{ color: '#004080' }}>{subStatus.plan}</span>
            </span>
            <span style={{ fontSize: '12px', color: '#64748b', borderLeft: '1px solid #cbd5e1', paddingLeft: '10px' }}>
              {subStatus.isPaidPlan ? '✨ Unlimited Access' : `⏳ ${subStatus.trialDaysRemaining} Days Left • 🪙 ${subStatus.credits} Credits`}
            </span>
          </div>

          {successMessage && (
            <div style={{
              marginTop: '16px', padding: '12px 20px', backgroundColor: '#dcfce7',
              color: '#15803d', borderRadius: '12px', fontSize: '14px', fontWeight: '700',
              border: '1px solid #86efac', animation: 'fadeIn 0.3s'
            }}>
              {successMessage}
            </div>
          )}
        </div>

        {/* Pricing Cards Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '28px', marginBottom: '40px' }}>
          
          {/* Plan 1: 3-Day Free Trial */}
          <div style={{
            backgroundColor: '#ffffff', borderRadius: '20px', padding: '32px 28px',
            border: subStatus.isTrialActive ? '2.5px solid #004080' : '1px solid #e2e8f0',
            boxShadow: '0 4px 20px rgba(0,0,0,0.04)', display: 'flex', flexDirection: 'column', position: 'relative'
          }}>
            {subStatus.isTrialActive && (
              <span style={{ position: 'absolute', top: '-12px', left: '28px', backgroundColor: '#004080', color: 'white', fontSize: '11.5px', fontWeight: '800', padding: '3px 12px', borderRadius: '12px' }}>
                ACTIVE TRIAL
              </span>
            )}
            <h3 style={{ fontSize: '22px', fontWeight: '800', color: '#0f172a', margin: '0 0 6px 0' }}>3-Day Free Trial</h3>
            <p style={{ color: '#64748b', fontSize: '13.5px', margin: '0 0 20px 0' }}>Experience full 3D sign translation for free.</p>
            
            <div style={{ marginBottom: '24px' }}>
              <span style={{ fontSize: '38px', fontWeight: '800', color: '#0f172a' }}>$0</span>
              <span style={{ color: '#64748b', fontSize: '14px', fontWeight: '600' }}> / for 3 days</span>
            </div>

            <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 30px 0', display: 'flex', flexDirection: 'column', gap: '12px', flex: 1 }}>
              <li style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '14px', color: '#334155' }}>
                <span style={{ color: '#10b981', fontWeight: 'bold' }}>✓</span> 50 Free AI Translation Credits
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '14px', color: '#334155' }}>
                <span style={{ color: '#10b981', fontWeight: 'bold' }}>✓</span> Access to A–Z & Core Vocabulary
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '14px', color: '#334155' }}>
                <span style={{ color: '#10b981', fontWeight: 'bold' }}>✓</span> Flashcards & Timed Quizzes
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '14px', color: '#334155' }}>
                <span style={{ color: '#10b981', fontWeight: 'bold' }}>✓</span> 3D Avatar (Luna)
              </li>
            </ul>

            <button
              onClick={handleResetTrial}
              style={{
                width: '100%', padding: '12px', borderRadius: '10px', border: '1.5px solid #cbd5e1',
                backgroundColor: '#f8fafc', color: '#0f172a', fontSize: '14px', fontWeight: '700',
                cursor: 'pointer', transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#e2e8f0'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#f8fafc'}
            >
              {subStatus.isTrialActive ? `Active (${subStatus.trialDaysRemaining}d remaining)` : 'Reset Free Trial 🔄'}
            </button>
          </div>

          {/* Plan 2: Pro Monthly ($5 / Month) */}
          <div style={{
            backgroundColor: '#ffffff', borderRadius: '20px', padding: '32px 28px',
            border: subStatus.plan.includes('$5') ? '2.5px solid #10b981' : '2px solid #6366f1',
            boxShadow: '0 8px 30px rgba(99, 102, 241, 0.12)', display: 'flex', flexDirection: 'column', position: 'relative'
          }}>
            <span style={{ position: 'absolute', top: '-12px', right: '28px', background: 'linear-gradient(135deg, #4f46e5, #7c3aed)', color: 'white', fontSize: '11px', fontWeight: '800', padding: '4px 14px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(99,102,241,0.3)' }}>
              POPULAR CHOICE 🚀
            </span>

            <h3 style={{ fontSize: '22px', fontWeight: '800', color: '#0f172a', margin: '0 0 6px 0' }}>Pro Monthly</h3>
            <p style={{ color: '#64748b', fontSize: '13.5px', margin: '0 0 20px 0' }}>Ideal for daily learners and educators.</p>
            
            <div style={{ marginBottom: '24px' }}>
              <span style={{ fontSize: '42px', fontWeight: '800', color: '#4338ca' }}>$5</span>
              <span style={{ color: '#64748b', fontSize: '14px', fontWeight: '600' }}> / month</span>
            </div>

            <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 30px 0', display: 'flex', flexDirection: 'column', gap: '12px', flex: 1 }}>
              <li style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '14px', color: '#1e1b4b', fontWeight: '600' }}>
                <span style={{ color: '#10b981', fontWeight: 'bold' }}>✓</span> <strong>Unlimited 3D Sign Translations</strong>
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '14px', color: '#1e1b4b', fontWeight: '600' }}>
                <span style={{ color: '#10b981', fontWeight: 'bold' }}>✓</span> <strong>Real-Time Camera Sign-to-Text</strong>
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '14px', color: '#334155' }}>
                <span style={{ color: '#10b981', fontWeight: 'bold' }}>✓</span> 500 AI LLM Chatbot Credits / Month
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '14px', color: '#334155' }}>
                <span style={{ color: '#10b981', fontWeight: 'bold' }}>✓</span> All 5 Avatars (Luna, Marc, Anna, Siggi, Francoise)
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '14px', color: '#334155' }}>
                <span style={{ color: '#10b981', fontWeight: 'bold' }}>✓</span> Streak Recovery Shield
              </li>
            </ul>

            <button
              onClick={() => handleUpgrade('monthly')}
              style={{
                width: '100%', padding: '14px', borderRadius: '10px', border: 'none',
                background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
                color: '#ffffff', fontSize: '15px', fontWeight: '800',
                cursor: 'pointer', transition: 'all 0.2s', boxShadow: '0 4px 14px rgba(79, 70, 229, 0.35)'
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
            >
              {subStatus.plan.includes('$5') ? 'Current Plan ✅' : 'Upgrade to Pro ($5/mo) ➔'}
            </button>
          </div>

          {/* Plan 3: Pro Annual ($60 / Year - Save 20%) */}
          <div style={{
            backgroundColor: '#ffffff', borderRadius: '20px', padding: '32px 28px',
            border: subStatus.plan.includes('$60') ? '2.5px solid #10b981' : '1px solid #e2e8f0',
            boxShadow: '0 4px 20px rgba(0,0,0,0.04)', display: 'flex', flexDirection: 'column', position: 'relative'
          }}>
            <span style={{ position: 'absolute', top: '-12px', right: '28px', backgroundColor: '#10b981', color: 'white', fontSize: '11px', fontWeight: '800', padding: '4px 12px', borderRadius: '12px' }}>
              SAVE 20% 💰
            </span>

            <h3 style={{ fontSize: '22px', fontWeight: '800', color: '#0f172a', margin: '0 0 6px 0' }}>Pro Annual</h3>
            <p style={{ color: '#64748b', fontSize: '13.5px', margin: '0 0 20px 0' }}>Best value for institutions & lifelong signers.</p>
            
            <div style={{ marginBottom: '24px' }}>
              <span style={{ fontSize: '42px', fontWeight: '800', color: '#059669' }}>$60</span>
              <span style={{ color: '#64748b', fontSize: '14px', fontWeight: '600' }}> / year ($5/mo billed yearly)</span>
            </div>

            <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 30px 0', display: 'flex', flexDirection: 'column', gap: '12px', flex: 1 }}>
              <li style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '14px', color: '#1e1b4b', fontWeight: '600' }}>
                <span style={{ color: '#10b981', fontWeight: 'bold' }}>✓</span> <strong>Everything in Pro Monthly</strong>
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '14px', color: '#1e1b4b', fontWeight: '600' }}>
                <span style={{ color: '#10b981', fontWeight: 'bold' }}>✓</span> <strong>Unlimited AI Assistant & Sign-to-Text</strong>
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '14px', color: '#334155' }}>
                <span style={{ color: '#10b981', fontWeight: 'bold' }}>✓</span> Priority GPU Animation Engine
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '14px', color: '#334155' }}>
                <span style={{ color: '#10b981', fontWeight: 'bold' }}>✓</span> Verified SignVerse Mastery Certificate
              </li>
            </ul>

            <button
              onClick={() => handleUpgrade('yearly')}
              style={{
                width: '100%', padding: '14px', borderRadius: '10px', border: 'none',
                background: 'linear-gradient(135deg, #059669 0%, #10b981 100%)',
                color: '#ffffff', fontSize: '15px', fontWeight: '800',
                cursor: 'pointer', transition: 'all 0.2s', boxShadow: '0 4px 14px rgba(16, 185, 129, 0.35)'
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
            >
              {subStatus.plan.includes('$60') ? 'Current Plan ✅' : 'Upgrade to Annual ($60/yr) ➔'}
            </button>
          </div>

        </div>

        {/* FAQ Card */}
        <div style={{ backgroundColor: '#ffffff', borderRadius: '16px', padding: '28px', border: '1px solid #e2e8f0' }}>
          <h3 style={{ margin: '0 0 16px 0', fontSize: '18px', fontWeight: '800', color: '#0f172a' }}>
            ❓ Frequently Asked Questions
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
            <div>
              <h4 style={{ margin: '0 0 4px 0', fontSize: '14.5px', color: '#004080', fontWeight: '700' }}>What happens after 3-Day Free Trial?</h4>
              <p style={{ margin: 0, fontSize: '13px', color: '#64748b', lineHeight: '1.5' }}>
                You can upgrade to our budget-friendly $5/month or $60/year plan anytime. Your streak and progress records are always safely preserved.
              </p>
            </div>
            <div>
              <h4 style={{ margin: '0 0 4px 0', fontSize: '14.5px', color: '#004080', fontWeight: '700' }}>How do AI translation credits work?</h4>
              <p style={{ margin: 0, fontSize: '13px', color: '#64748b', lineHeight: '1.5' }}>
                Free trial users receive 50 AI credits to test real-time Sign-to-Text camera recognition and AI voice translation. Pro plans include unlimited 3D signs.
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
