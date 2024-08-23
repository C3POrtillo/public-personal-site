import { useEffect, useState } from 'react';
import isEmail from 'validator/lib/isEmail';

import type { FC } from 'react';

import FormModal from '@/components/form/FormModal';
import Button from '@/components/inputs/Button/Button';
import Text from '@/components/inputs/Text/Text';
import { useAuth } from '@/components/tfd/accounts/AuthProvider';
import { minPasswordLength } from '@/components/tfd/accounts/types';
import { accountRequest } from '@/components/tfd/accounts/utils';

const label = 'Login' as const;

const Login: FC = () => {
  const { isAuthenticated, login } = useAuth();
  const [isOpen, setOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [disabled, setDisabled] = useState(false);
  const [error, setError] = useState(false);

  const validate = () => {
    const validEmail = !!email.length;
    const validPassword = password.length >= minPasswordLength;

    return validEmail && validPassword;
  };

  useEffect(() => {
    setDisabled(!validate());
  }, [email, password]);

  const handleClick = async () => {
    setError(false);
    const success = await accountRequest('login', { email, password });
    if (success) {
      login(success);
      setOpen(false);
    } else {
      setError(true);
    }
  };

  return (
    <FormModal label={label} isOpen={isOpen} setOpen={setOpen}>
      {isAuthenticated ? (
        <span>Successfully logged in</span>
      ) : (
        <>
          <Text
            label="Email"
            placeholder="example@gmail.com"
            value={email}
            setState={setEmail}
            validate={isEmail}
            required
          />
          <Text
            id="login-password"
            label="Password"
            type="password"
            value={password}
            setState={setPassword}
            minLength={minPasswordLength}
            required
          />
          <div>
            <Button size="button-sm" onClick={handleClick} disabled={disabled}>
              {label}
            </Button>
          </div>
          <span className="h-6 text-red-400">{error && 'Error logging in'}</span>
        </>
      )}
    </FormModal>
  );
};

export default Login;
