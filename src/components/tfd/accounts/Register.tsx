import { useEffect, useState } from 'react';
import isEmail from 'validator/lib/isEmail';

import type { FC } from 'react';

import FormModal from '@/components/form/FormModal';
import Button from '@/components/inputs/Button/Button';
import Text from '@/components/inputs/Text/Text';
import { useAuth } from '@/components/tfd/accounts/AuthProvider';
import { maxUsernameLength, minPasswordLength } from '@/components/tfd/accounts/types';
import { accountRequest } from '@/components/tfd/accounts/utils';

const label = 'Register' as const;

const Register: FC = () => {
  const { isAuthenticated, login } = useAuth();
  const [isOpen, setOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [disabled, setDisabled] = useState(false);
  const [error, setError] = useState(false);

  const validate = () => {
    const validEmail = isEmail(email);
    const validUsername = !!username.length && username.length <= maxUsernameLength;
    const validPassword = password.length >= minPasswordLength;

    return validEmail && validUsername && validPassword;
  };

  useEffect(() => {
    setDisabled(!validate());
  }, [email, username, password]);

  const handleClick = async () => {
    const success = await accountRequest('register', { email, username, password });
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
        <span>Successfully registered</span>
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
            label="Username"
            placeholder={`Max ${maxUsernameLength} characters`}
            value={username}
            setState={setUsername}
            maxLength={maxUsernameLength}
            required
          />
          <Text
            id="register-password"
            label="Password"
            placeholder={`Min. ${minPasswordLength} characters`}
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
          <span className="h-6 text-red-400">{error && 'Email or username in use'}</span>
        </>
      )}
    </FormModal>
  );
};

export default Register;
