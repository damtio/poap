import React, { useState, useCallback } from 'react';
import { loginMetamask } from '../poap-eth';
import { useToggleState } from '../react-helpers';
import { resolveENS } from '../api';
import { getAddress } from 'ethers/utils';
import classNames from 'classnames';

type ChooseAddressPageProps = {
  onAccountDetails: (account: string) => void;
};
export const ChooseAddressPage: React.FC<ChooseAddressPageProps> = ({ onAccountDetails }) => {
  const [enterByHand, toggleEnterByHand] = useToggleState(false);
  return (
    <main id="site-main" role="main" className="app-content">
      <div className="container">
        <div className="content-event" data-aos="fade-up" data-aos-delay="300">
          <p>
            The <span>Proof of attendance protocol</span> (POAP) reminds you off the{' '}
            <span>cool places</span> you’ve been to.
          </p>
          {enterByHand ? (
            <AddressInput onAddress={onAccountDetails} />
          ) : (
            <>
              <p>Your browser is Web3 enabled</p>
              <LoginButton onAddress={onAccountDetails} />
              <p>
                or{' '}
                <a
                  href="/"
                  onClick={e => {
                    e.preventDefault();
                    toggleEnterByHand();
                  }}
                >
                  enter on address by hand
                </a>
              </p>
            </>
          )}
        </div>
      </div>
    </main>
  );
};

type LoginButtonProps = {
  onAddress: (account: string) => void;
};

const LoginButton: React.FC<LoginButtonProps> = ({ onAddress }) => {
  const doLogin = useCallback(async () => {
    const loginData = await loginMetamask();
    onAddress(loginData.account);
  }, [onAddress]);
  return (
    <button className="btn" onClick={doLogin}>
      <span>Login</span>
      <br />
      <span className="small-text">with Metamask</span>
    </button>
  );
};

type AddressInputProps = {
  onAddress: (address: string) => void;
};

const AddressInput: React.FC<AddressInputProps> = ({ onAddress }) => {
  const [address, setAddress] = useState('');
  const [ensError, setEnsError] = useState(false);
  const [working, setWorking] = useState(false);
  const handleChange: React.ChangeEventHandler<HTMLInputElement> = e => {
    setAddress(e.target.value);
    if (ensError) {
      setEnsError(false);
    }
  };
  const onSubmit: React.FormEventHandler = async e => {
    e.preventDefault();
    if (isValidAddress(address)) {
      onAddress(address);
    } else {
      setEnsError(false);
      setWorking(true);
      const ensResponse = await resolveENS(address);
      setWorking(false);
      if (ensResponse.exists) {
        onAddress(ensResponse.address);
      } else {
        setEnsError(true);
      }
    }
  };
  return (
    <form className="login-form" onSubmit={onSubmit}>
      <input
        type="text"
        id="address"
        required
        placeholder="evanvanness.eth"
        onChange={handleChange}
        className={classNames(ensError && 'error')}
      />
      {ensError && <p className="text-error">Invalid ENS name</p>}
      <input
        type="submit"
        id="submit"
        value={working ? '' : 'Display Badges'}
        disabled={working}
        className={classNames(working && 'loading')}
        name="submit"
      />
    </form>
  );
};

function isValidAddress(str: string) {
  try {
    getAddress(str);
    return true;
  } catch (e) {
    // invalid Address. Try ENS
    return false;
  }
}