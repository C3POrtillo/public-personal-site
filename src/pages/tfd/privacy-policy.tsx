import type { GetStaticProps } from 'next/types';
import type { NextSeoProps } from 'next-seo';
import type { FC } from 'react';

import Container from '@/components/container/Container';
import Footer from '@/components/tfd/footer/Footer';
import Header from '@/components/tfd/header/Header';
import { getTfdSeo } from '@/utils/utils';

interface EhpCalcProps {
  seo: NextSeoProps;
}

const EhpCalc: FC<EhpCalcProps> = ({ seo }) => (
  <>
    <Header seo={seo} />
    <Container>
      <div className="privacy-policy flex flex-col gap-1">
        <h1 className="text-center">Privacy Policy</h1>
        <span className="text-center">
          <strong>Effective Date:</strong> {'August 22, 2024'}
        </span>
        <h2>1. Introduction</h2>
        <p className="inset-section">
          {`Welcome to ortillo.cam ("we," "our," "us"). We are committed to protecting your privacy and ensuring
          that your personal information is handled in a safe and responsible manner. This Privacy Policy explains what
          personal data we collect, how we use it, and your rights concerning your data.`}
        </p>
        <h2>2. Data Collection</h2>
        <div className="inset-section">
          <p>We collect the following personal information when you create an account on our platform:</p>
          <ul>
            <li>Username</li>
            <li>Password</li>
            <li>Email address</li>
          </ul>
        </div>
        <p className="inset-section">
          We do not collect any other personal information unless you voluntarily provide it to us.
        </p>
        <h2>3. Cookies</h2>
        <p className="inset-section">
          {`We use cookies on our website to improve your experience. These cookies are to verify your login session for a
          registered user and to track your current wishlist data on "ortillo.cam/tfd/wishlist". The cookies do not track
          your activity across other websites and are only used for session management.`}
        </p>
        <h2>4. Legal Basis for Processing (EU Users)</h2>
        <div className="inset-section">
          <p>
            If you are located in the European Union, we process your personal information based on the following legal
            grounds under the General Data Protection Regulation (GDPR):
          </p>
          <ul>
            <li>
              <strong>Consent:</strong> You have provided your consent for us to process your personal data for the
              specific purposes outlined in this Privacy Policy.
            </li>
            <li>
              <strong>Contractual Necessity:</strong> The processing is necessary to perform the services you have
              requested.
            </li>
          </ul>
        </div>
        <h2>5. How We Use Your Data</h2>
        <div className="inset-section">
          <p>We use the personal information collected for the following purposes:</p>
          <ul>
            <li>To create and manage your account.</li>
            <li>To provide and improve our services.</li>
          </ul>
        </div>
        <p className="inset-section">We will never sell or rent your personal information to third parties.</p>
        <h2>6. Data Sharing</h2>
        <p className="inset-section">
          We do not share your personal data with third parties, except when required by law or necessary for the
          provision of our services (e.g., using third-party services to manage user authentication).
        </p>
        <h2>7. Data Retention</h2>
        <div className="inset-section">
          <p>
            We retain your personal data for as long as your account is active or as long as necessary to provide you
            with our services. Once your account is deleted, we will securely delete your personal information. At the
            moment accounts can only be deleted by contacting us through:
          </p>
          <ul>
            <li>
              <strong>Email: </strong>support@ortillo.cam
            </li>
            <li>
              <strong>Discord: </strong>cam_ilo
            </li>
          </ul>
        </div>
        <h2>8. Your Rights</h2>
        <div className="inset-section">
          <p>Depending on your location, you have certain rights regarding your personal information, including:</p>
          <ul>
            <li>
              <strong>Right to Access:</strong> You can request a copy of the personal information we hold about you.
            </li>
            <li>
              <strong>Right to Rectification:</strong> You can ask us to correct or update any inaccurate data.
            </li>
            <li>
              <strong>Right to Erasure:</strong> You can request that we delete your personal data.
            </li>
            <li>
              <strong>Right to Restriction of Processing:</strong> You can request that we limit how we use your
              personal data.
            </li>
            <li>
              <strong>Right to Data Portability:</strong> You can request a copy of your personal data in a
              machine-readable format.
            </li>
            <li>
              <strong>Right to Object:</strong> You can object to our processing of your personal data for certain
              purposes.
            </li>
          </ul>
        </div>
        <div className="inset-section">
          <p>To exercise any of these rights, please contact us through:.</p>
          <ul>
            <li>
              <strong>Email: </strong>support@ortillo.cam
            </li>
            <li>
              <strong>Discord: </strong>cam_ilo
            </li>
          </ul>
        </div>
        <h2>9. Security</h2>
        <p className="inset-section">
          We implement appropriate technical and organizational measures to protect your personal data from unauthorized
          access, loss, or misuse. However, no system is completely secure, and we cannot guarantee the absolute
          security of your data.
        </p>
        <h2>10. International Data Transfers</h2>
        <p className="inset-section">
          If you are located outside the United States, please be aware that your data may be transferred to, stored,
          and processed in the United States. By using our services, you consent to such data transfers.
        </p>
        <h2>11. Compliance with Privacy Laws</h2>
        <div className="inset-section">
          <p>We comply with applicable privacy laws in the regions where we operate, including:</p>
          <ul>
            <li>
              <strong>California Consumer Privacy Act (CCPA)</strong> for California residents.
            </li>
            <li>
              <strong>General Data Protection Regulation (GDPR)</strong> for users located in the European Union.
            </li>
            <li>
              <strong>Personal Information Protection and Electronic Documents Act (PIPEDA)</strong> for Canadian
              residents.
            </li>
          </ul>
        </div>
        <div className="inset-section">
          <p>
            If you are a resident of these jurisdictions, you may have additional rights regarding your personal data.
            Please refer to the relevant sections of this Privacy Policy or contact us for more information through:.
          </p>
          <ul>
            <li>
              <strong>Email: </strong>support@ortillo.cam
            </li>
            <li>
              <strong>Discord: </strong>cam_ilo
            </li>
          </ul>
        </div>
        <h2>12. CCPA Privacy Rights (California Residents)</h2>
        <div className="inset-section">
          <p>
            Under the California Consumer Privacy Act (CCPA), California residents have specific rights regarding their
            personal information. This section describes those rights and how to exercise them.
          </p>
          <ul>
            <li>
              <strong>Right to Know:</strong> You have the right to request that we disclose certain information to you
              about our collection and use of your personal data over the past 12 months.
            </li>
            <li>
              <strong>Right to Delete:</strong> You have the right to request that we delete any of your personal
              information that we collected from you and retained, subject to certain exceptions.
            </li>
            <li>
              <strong>Right to Opt-Out of Sale:</strong> We do not sell personal information to third parties. If we
              ever engage in this practice, you will have the right to opt out.
            </li>
          </ul>
        </div>
        <div className="inset-section">
          <p>To exercise any of these rights, please contact us through:</p>
          <ul>
            <li>
              <strong>Email: </strong>support@ortillo.cam
            </li>
            <li>
              <strong>Discord: </strong>cam_ilo
            </li>
          </ul>
        </div>
        <h2>13. GDPR Privacy Rights (EU Residents)</h2>
        <div className="inset-section">
          <p>
            If you are located in the European Union, you are entitled to the following rights under the General Data
            Protection Regulation (GDPR):
          </p>
          <ul>
            <li>
              <strong>Right to Access:</strong> You can request access to the personal information we hold about you.
            </li>
            <li>
              <strong>Right to Rectification:</strong> You can request that we correct any inaccurate or incomplete
              data.
            </li>
            <li>
              <strong>Right to Erasure:</strong> You can request that we delete your personal data in certain
              circumstances.
            </li>
            <li>
              <strong>Right to Restriction:</strong> You can request that we limit the processing of your personal data.
            </li>
            <li>
              <strong>Right to Data Portability:</strong> You can request that we transfer your data to another
              organization or directly to you.
            </li>
            <li>
              <strong>Right to Object:</strong> You can object to our processing of your personal data in certain cases.
            </li>
          </ul>
        </div>
        <div className="inset-section">
          <p>To exercise any of these rights, please contact us through:</p>
          <ul>
            <li>
              <strong>Email: </strong>support@ortillo.cam
            </li>
            <li>
              <strong>Discord: </strong>cam_ilo
            </li>
          </ul>
        </div>
        <h2>14. PIPEDA Privacy Rights (Canadian Residents)</h2>
        <div className="inset-section">
          <p>
            Under the Personal Information Protection and Electronic Documents Act (PIPEDA), Canadian residents have the
            right to:
          </p>
          <ul>
            <li>
              <strong>Access and Correct:</strong> You can request access to your personal information and correct any
              inaccuracies.
            </li>
            <li>
              <strong>Withdraw Consent:</strong> You may withdraw your consent to the processing of your personal
              information at any time, subject to legal or contractual restrictions.
            </li>
          </ul>
        </div>
        <div className="inset-section">
          <p>To exercise any of these rights, please contact us through:</p>
          <ul>
            <li>
              <strong>Email: </strong>support@ortillo.cam
            </li>
            <li>
              <strong>Discord: </strong>cam_ilo
            </li>
          </ul>
        </div>
        <h2>{"15. Children's Privacy"}</h2>
        <p className="inset-section">
          Our services are not intended for children under the age of 13. We do not knowingly collect personal
          information from children under 13. If we become aware that we have collected personal information from a
          child under 13, we will take steps to delete that information.
        </p>
        <h2>16. Changes to This Privacy Policy</h2>
        <p className="inset-section">
          We may update this Privacy Policy from time to time. If we make any significant changes, we will notify you
          via email or by posting a notice on our website. Your continued use of our services after the changes have
          been implemented constitutes your acceptance of the new policy.
        </p>
        <h2>17. Contact Us</h2>
        <div className="inset-section">
          <p>
            If you have any questions or concerns about this Privacy Policy or how we handle your personal information,
            please contact us at:
          </p>
          <ul>
            <li>
              <strong>Email: </strong>support@ortillo.cam
            </li>
            <li>
              <strong>Discord: </strong>cam_ilo
            </li>
          </ul>
        </div>
      </div>
    </Container>
    <Footer />
  </>
);

export const getStaticProps = (async () => {
  const title = 'Privacy Policy | /tfd';
  const description = 'Privacy Policy for ortillo.cam/tfd';
  const slug = '/privacy-policy';

  return {
    props: {
      seo: getTfdSeo({ title, description, slug }),
    },
  };
}) satisfies GetStaticProps;

export default EhpCalc;
