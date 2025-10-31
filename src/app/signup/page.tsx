import AuthForm from "@/components/AuthForm";
import Container from "@/components/Container";
import Title from "@/components/Title";

export default function SignupPage() {
  return (
    <Container>
      <Title>회원가입</Title>
      <AuthForm type="signup" />
    </Container>
  );
}