// components/emails/ContactFormEmail.tsx
import { Html, Head, Body, Container, Text, Section, Heading } from '@react-email/components';

interface ContactFormEmailProps {
  name: string;
  email: string;
  message: string;
}

export default function ContactFormEmail({ name, email, message }: ContactFormEmailProps) {
  return (
    <Html>
      <Head />
      <Body style={bodyStyle}>
        <Container style={containerStyle}>
          <Heading style={headingStyle}>New Message from {name}</Heading>
          <Section>
            <Text style={textStyle}>
              <strong>Name:</strong> {name}
            </Text>
            <Text style={textStyle}>
              <strong>Email:</strong> {email}
            </Text>
            <Text style={textStyle}>
              <strong>Message:</strong>
            </Text>
            <Text style={messageStyle}>{message}</Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

const bodyStyle = {
  backgroundColor: '#f7fafc',
  fontFamily: 'Arial, sans-serif',
};

const containerStyle = {
  backgroundColor: '#ffffff',
  margin: '0 auto',
  padding: '20px',
  borderRadius: '8px',
  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
};

const headingStyle = {
  color: '#2d3748',
  fontSize: '24px',
  marginBottom: '20px',
};

const textStyle = {
  color: '#4a5568',
  fontSize: '16px',
  marginBottom: '10px',
};

const messageStyle = {
  color: '#4a5568',
  fontSize: '16px',
  lineHeight: '1.5',
};