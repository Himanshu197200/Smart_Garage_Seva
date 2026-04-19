import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Check, ArrowRight } from 'lucide-react';

const plans = [
  {
    name: 'Starter',
    monthly: '999',
    annual: '799',
    featured: false,
    features: [
      '1 Garage Location',
      'Up to 100 Jobs/month',
      '2 User Accounts',
      'Basic Inventory Tracking',
      'Email Notifications',
      'Standard Reports'
    ],
    cta: 'Start Free Trial',
    link: '/register'
  },
  {
    name: 'Professional',
    monthly: '2,499',
    annual: '1,999',
    featured: true,
    features: [
      'Up to 3 Garage Locations',
      'Unlimited Jobs',
      '10 User Accounts',
      'Advanced Inventory with Alerts',
      'SMS + Email Notifications',
      'Predictive Maintenance AI',
      'Advanced Analytics',
      'Priority Support'
    ],
    cta: 'Start Free Trial',
    link: '/register'
  },
  {
    name: 'Enterprise',
    monthly: 'Custom',
    annual: 'Custom',
    featured: false,
    features: [
      'Unlimited Locations',
      'Unlimited Everything',
      'Unlimited Users',
      'Custom Integrations',
      'Dedicated Account Manager',
      'On-premise Deployment Option',
      'SLA Guarantee',
      'Custom Training'
    ],
    cta: 'Contact Sales',
    link: '/contact'
  }
];

export default function PricingPage() {
  const [annual, setAnnual] = useState(false);

  return (
    <>
      <section className="page-hero">
        <div className="section-container">
          <div className="section-eyebrow">Pricing</div>
          <h1 className="page-hero-title">Simple, transparent pricing</h1>
          <p className="page-hero-sub">No hidden fees. Start with a 14-day free trial. Cancel anytime.</p>
        </div>
      </section>

      <section className="pricing-section" style={{ paddingTop: 20 }}>
        <div className="section-container">
          <div className="pricing-toggle">
            <span className="pricing-toggle-label" style={{ fontWeight: !annual ? 600 : 400, color: !annual ? '#1E293B' : '#94A3B8' }}>Monthly</span>
            <button
              onClick={() => setAnnual(!annual)}
              style={{
                width: 48, height: 26, borderRadius: 13, border: 'none',
                background: annual ? '#EA580C' : '#CBD5E1', cursor: 'pointer',
                position: 'relative', transition: 'background 0.2s'
              }}
            >
              <div style={{
                width: 20, height: 20, borderRadius: '50%', background: 'white',
                position: 'absolute', top: 3,
                left: annual ? 25 : 3, transition: 'left 0.2s',
                boxShadow: '0 1px 3px rgba(0,0,0,0.2)'
              }} />
            </button>
            <span className="pricing-toggle-label" style={{ fontWeight: annual ? 600 : 400, color: annual ? '#1E293B' : '#94A3B8' }}>
              Annual <span style={{ color: '#10B981', fontSize: 12, fontWeight: 600 }}>Save 20%</span>
            </span>
          </div>

          <div className="pricing-grid">
            {plans.map(plan => (
              <div key={plan.name} className={`pricing-card ${plan.featured ? 'featured' : ''}`}>
                {plan.featured && <div className="pricing-badge">MOST POPULAR</div>}
                <div className="pricing-name">{plan.name}</div>
                <div className="pricing-price">
                  {plan.monthly === 'Custom' ? (
                    'Custom'
                  ) : (
                    <>₹{annual ? plan.annual : plan.monthly}<span>/mo</span></>
                  )}
                </div>
                <ul className="pricing-features">
                  {plan.features.map(f => (
                    <li key={f}>
                      <Check size={16} className="check-icon" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Link
                  to={plan.link}
                  className="btn-get-started"
                  style={{
                    width: '100%', justifyContent: 'center',
                    background: plan.featured ? '#EA580C' : 'transparent',
                    color: plan.featured ? 'white' : '#EA580C',
                    border: plan.featured ? 'none' : '1px solid #EA580C'
                  }}
                >
                  {plan.cta} <ArrowRight size={16} />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
