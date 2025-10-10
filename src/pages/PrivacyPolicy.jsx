import React from 'react';
import { Footer, Navbar } from '../components';
import '../styles/privacypolicy.css';

const PrivacyPolicy = () => (
    <div className="privacy-policy-wrapper">
        <Navbar />
        <div className="privacy-policy-content">
            <div className="privacy-policy-container">
                <h3 className='privacy-policy-title'>Privacy Policy</h3>
                <p>
                    Your privacy is important to us. This Privacy Policy explains how we collect, use, and protect your personal information when you use our website.
                </p>
                <h4>Information We Collect</h4>
                <ul>
                    <li>Personal information you provide (such as name, email address, etc.)</li>
                    <li>Usage data and cookies to improve your experience</li>
                </ul>
                <h4>How We Use Your Information</h4>
                <ul>
                    <li>To provide and improve our services</li>
                    <li>To communicate with you</li>
                    <li>To comply with legal obligations</li>
                </ul>
                <h4>Sharing Your Information</h4>
                <p>
                    We do not sell your personal information. We may share data with trusted third parties to operate our website and services.
                </p>
                <h4>Your Rights</h4>
                <ul>
                    <li>You can request access to your personal data</li>
                    <li>You can request correction or deletion of your data</li>
                </ul>
                <h4>Contact Us</h4>
                <p>
                    If you have any questions about this Privacy Policy, please contact us at support@example.com.
                </p>
                <p>
                    This policy may be updated from time to time. Please review it periodically.
                </p>
            </div>
        </div>
        <Footer />
    </div>
);

export default PrivacyPolicy;