import AuthForm from '@/components/AuthForm';
import Container from '@/components/Container';
import Title from '@/components/Title';

export default function LoginPage() {
  return (
    <Container>
      <Title>로그인</Title>
      <AuthForm type="login" />
    </Container>
  );
}