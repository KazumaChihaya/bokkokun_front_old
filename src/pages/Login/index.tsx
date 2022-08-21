import styles from './index.module.less';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { Alert, message } from 'antd';
import React, { useState } from 'react';
import { LoginForm, ProFormCheckbox, ProFormText } from '@ant-design/pro-form';
import { useLocation, useNavigate } from 'react-router-dom';
import Footer from '@/layouts/components/Footer';
import { LoginParams, useLoginMutation } from '@/services/auth/auth';
import { AxiosError } from 'axios';

const LoginMessage: React.FC<{
  content: string;
}> = ({ content }) => (
  <Alert
    style={{
      marginBottom: 24,
    }}
    message={content}
    type="error"
    showIcon
  />
);

const Login: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const { mutateAsync: login } = useLoginMutation();

  const [status, setStatus] = useState('');

  const handleSubmit = async (values: LoginParams) => {
    try {
      const msg = await login({ ...values });
      if (msg.result === 'ok') {
        const defaultLoginSuccessMessage = 'ログイン成功！';
        message.success(defaultLoginSuccessMessage);
        /** redirect(クエパラ)で指定されたページに移動 */
        if (!history) return;
        if (msg.type === 'manager') {
          navigate('/manager/artists');
        } else {
          navigate('/artist/home');
        }
        return;
      }
    } catch (e) {
      const error = e as AxiosError;
      if (error.response?.status === 401) {
        setStatus('error');
      }
      const defaultLoginFailureMessage =
        'ログインに失敗しました、再度やり直してください';
      message.error(defaultLoginFailureMessage);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <LoginForm
          title="BOKCOMログイン"
          subTitle=" "
          initialValues={{
            autoLogin: true,
          }}
          onFinish={async (values) => {
            await handleSubmit(values as LoginParams);
          }}
          submitter={{}}
        >
          {status === 'error' && (
            <LoginMessage content="ユーザー名かパスワードが間違っています" />
          )}
          <ProFormText
            name="mail"
            fieldProps={{
              size: 'large',
              prefix: <UserOutlined className={styles.prefixIcon} />,
            }}
            placeholder="ユーザー名"
            rules={[
              {
                required: true,
                message: 'ユーザー名を入力してください',
              },
            ]}
          />
          <ProFormText.Password
            name="pass"
            fieldProps={{
              size: 'large',
              prefix: <LockOutlined className={styles.prefixIcon} />,
            }}
            placeholder="パスワード"
            rules={[
              {
                required: true,
                message: 'パスワードを入力してください',
              },
            ]}
          />

          <div
            style={{
              marginBottom: 24,
            }}
          >
            <ProFormCheckbox noStyle name="autoLogin">
              ログイン状態を保持する
            </ProFormCheckbox>
            {/*
            <a
              style={{
                float: 'right',
              }}
            >
              パスワードを忘れた場合
            </a>*/}
          </div>
        </LoginForm>
      </div>
      <Footer />
    </div>
  );
};

export default Login;
