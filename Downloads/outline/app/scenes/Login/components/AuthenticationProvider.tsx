import { EmailIcon } from "outline-icons";
import * as React from "react";
import { useTranslation } from "react-i18next";
import styled from "styled-components";
import ButtonLarge from "~/components/ButtonLarge";
import InputLarge from "~/components/InputLarge";
import PluginIcon from "~/components/PluginIcon";
import { client } from "~/utils/ApiClient";
import Desktop from "~/utils/Desktop";
import { getRedirectUrl } from "../getRedirectUrl";

type Props = {
  id: string;
  name: string;
  authUrl: string;
  isCreate: boolean;
  onEmailSuccess: (email: string) => void;
};

function AuthenticationProvider(props: Props) {
  const { t } = useTranslation();
  const [showEmailSignin, setShowEmailSignin] = React.useState(false);
  const [isSubmitting, setSubmitting] = React.useState(false);
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const { isCreate, id, name, authUrl } = props;

  const handleChangeEmail = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
  };

    const handleChangePassword = (event: React.ChangeEvent<HTMLInputElement>) => {
        setPassword(event.target.value);
    };

  const handleSubmitEmail = async (
    event: React.SyntheticEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    if (showEmailSignin && email) {
      setSubmitting(true);

      try {
        const response = await client.post(event.currentTarget.action, {
          email,
          client: Desktop.isElectron() ? "desktop" : undefined,
        });

        if (response.redirect) {
          window.location.href = response.redirect;
        } else {
          props.onEmailSuccess(email);
        }
      } finally {
        setSubmitting(false);
      }
    } else {
      setShowEmailSignin(true);
    }
  };

  const handleLogin = async (
      event: React.SyntheticEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    if (showEmailSignin && email && password) {
      setSubmitting(true);
      try {
        const response = await client.post(event.currentTarget.action, {
          email,
          password,
          client: Desktop.isElectron() ? "desktop" : undefined,
        });
        if (response.redirect) {
          window.location.href = response.redirect;
        } else {
          if (response.success) {
            window.location.href = "/auth/email.callback?token=" + response.token + "&amp;client=web";
          } else {
            window.alert("用户名和密码不匹配，请重新输入")
          }
          props.onEmailSuccess(email);
        }
      }catch (e){
        console.log(e)
      } finally {
        setSubmitting(false);
      }
    } else {
      setShowEmailSignin(true);
    }
  };

  const href = getRedirectUrl(authUrl);

  if (id === "email") {
    if (isCreate) {
      return null;
    }

    return (
      <Wrapper>
        <Form method="POST" action="/auth/login" onSubmit={handleLogin}>
          {showEmailSignin ? (
            <>
              <InputLarge
                type="email"
                name="email"
                placeholder="用户名"
                value={email}
                onChange={handleChangeEmail}
                disabled={isSubmitting}
                autoFocus
                required
                short
              />
              <InputLarge
                  type="password"
                  name="email"
                  placeholder="密码"
                  value={password}
                  onChange={handleChangePassword}
                  disabled={isSubmitting}
                  autoFocus
                  required
                  short
              />
              <ButtonLarge type="submit" disabled={isSubmitting}>
                {t("Sign In")} →
              </ButtonLarge>
            </>
          ) : (
            <ButtonLarge type="submit" icon={<EmailIcon />} fullwidth>
              {t("Continue with Email")}
            </ButtonLarge>
          )}
        </Form>
      </Wrapper>
    );
  }

  return (
    <Wrapper>
      <ButtonLarge
        onClick={() => (window.location.href = href)}
        icon={<PluginIcon id={id} />}
        fullwidth
      >
        {t("Continue with {{ authProviderName }}", {
          authProviderName: name,
        })}
      </ButtonLarge>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  width: 100%;
`;

const Form = styled.form`
  width: 100%;
  display: flex;
  justify-content: space-between;
`;

export default AuthenticationProvider;
