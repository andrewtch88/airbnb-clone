import {
  Body,
  Button,
  Container,
  Head,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Row,
  Section,
  Text,
} from '@react-email/components'
import * as React from 'react'

interface AirbnbReviewEmailProps {
  tenantName?: string
  tenantImage?: string
  reviewText?: string
  startDate?: string
}

export const BookingConfirmation = ({
  tenantName,
  tenantImage,
  reviewText,
  startDate,
}: AirbnbReviewEmailProps) => {
  const previewText = `New booking by ${tenantName}`

  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>

      <Body style={main}>
        <Container style={container}>
          <Section>
            <Img src={`/images/logo.png`} width="96" height="30" alt="Airbnb" />
          </Section>
          <Section>
            <Img
              src={tenantImage}
              width="96"
              height="96"
              alt={tenantName}
              style={userImage}
            />
          </Section>
          <Section style={{ paddingBottom: '20px' }}>
            <Row>
              <Text style={heading}>
                New booking confirmed! {tenantName} arrives {startDate}.
              </Text>
              <Text style={message}>{reviewText}</Text>

              <Button
                style={button}
                href="http://localhost:3000/myReservations"
              >
                View my reservations
              </Button>
            </Row>
          </Section>

          <Hr style={hr} />

          <Section>
            <Row>
              <Text style={footer}>
                Airbnb, Inc., 888 Brannan St, San Francisco, CA 94103
              </Text>
            </Row>
          </Section>
        </Container>
      </Body>
    </Html>
  )
}

export default BookingConfirmation

const main = {
  backgroundColor: '#ffffff',
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
}

const container = {
  margin: '0 auto',
  padding: '20px 0 48px',
  width: '580px',
  maxWidth: '100%',
}

const userImage = {
  margin: '0 auto',
  marginBottom: '16px',
  borderRadius: '50%',
}

const heading = {
  fontSize: '32px',
  lineHeight: '1.3',
  fontWeight: '700',
  color: '#484848',
}

const paragraph = {
  fontSize: '18px',
  lineHeight: '1.4',
  color: '#484848',
}

const message = {
  ...paragraph,
  padding: '24px',
  backgroundColor: '#f2f3f3',
  borderRadius: '4px',
}

const button = {
  backgroundColor: '#ff5a5f',
  borderRadius: '3px',
  color: '#fff',
  fontSize: '18px',
  paddingTop: '19px',
  paddingBottom: '19px',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'block',
  width: '100%',
}

const link = {
  ...paragraph,
  color: '#ff5a5f',
  display: 'block',
}

const reportLink = {
  fontSize: '14px',
  color: '#9ca299',
  textDecoration: 'underline',
}

const hr = {
  borderColor: '#cccccc',
  margin: '20px 0',
}

const footer = {
  color: '#9ca299',
  fontSize: '14px',
  marginBottom: '10px',
}
