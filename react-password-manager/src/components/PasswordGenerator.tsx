import React, { useState } from 'react';

interface Props {
  onUsePassword: (password: string) => void;
}

const PasswordGenerator: React.FC<Props> = ({ onUsePassword }) => {
  const [passwordLength, setPasswordLength] = useState(12);
  const [includeUppercase, setIncludeUppercase] = useState(true);
  const [includeLowercase, setIncludeLowercase] = useState(true);
  const [includeNumbers, setIncludeNumbers] = useState(true);
  const [includeSymbols, setIncludeSymbols] = useState(true);
  const [password, setPassword] = useState('');
  const [copied, setCopied] = useState(false);

  const generatePassword = () => {
    const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const lowercase = 'abcdefghijklmnopqrstuvwxyz';
    const numbers = '0123456789';
    const symbols = '!@#$%^&*()_+~`|}{[]:;?><,./-=';

    let characters = '';
    if (includeUppercase) characters += uppercase;
    if (includeLowercase) characters += lowercase;
    if (includeNumbers) characters += numbers;
    if (includeSymbols) characters += symbols;

    if (characters.length === 0) {
      setPassword('❌ Please select at least one character type.');
      return;
    }

    let generated = '';
    for (let i = 0; i < passwordLength; i++) {
      generated += characters.charAt(Math.floor(Math.random() * characters.length));
    }

    setPassword(generated);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(password);
    setCopied(true);
    setTimeout(() => setCopied(false), 1000);
  };

  return (
    <div className="bg-light p-3 rounded border">
      <h5 className="text-center mb-3">Generate a random password</h5>

      <div className="mb-2">
        <label className="form-label">Password Length: {passwordLength}</label>
        <input
          type="range"
          className="form-range"
          min={8}
          max={32}
          value={passwordLength}
          onChange={(e) => setPasswordLength(Number(e.target.value))}
        />
      </div>

      <div className="mb-3 d-flex flex-wrap gap-3">
        <div className="form-check">
          <input
            type="checkbox"
            className="form-check-input"
            checked={includeUppercase}
            onChange={(e) => setIncludeUppercase(e.target.checked)}
            id="uppercaseCheck"
          />
          <label className="form-check-label" htmlFor="uppercaseCheck">Uppercase</label>
        </div>

        <div className="form-check">
          <input
            type="checkbox"
            className="form-check-input"
            checked={includeLowercase}
            onChange={(e) => setIncludeLowercase(e.target.checked)}
            id="lowercaseCheck"
          />
          <label className="form-check-label" htmlFor="lowercaseCheck">Lowercase</label>
        </div>

        <div className="form-check">
          <input
            type="checkbox"
            className="form-check-input"
            checked={includeNumbers}
            onChange={(e) => setIncludeNumbers(e.target.checked)}
            id="numbersCheck"
          />
          <label className="form-check-label" htmlFor="numbersCheck">Numbers</label>
        </div>

        <div className="form-check">
          <input
            type="checkbox"
            className="form-check-input"
            checked={includeSymbols}
            onChange={(e) => setIncludeSymbols(e.target.checked)}
            id="symbolsCheck"
          />
          <label className="form-check-label" htmlFor="symbolsCheck">Symbols</label>
        </div>
      </div>

      <div className="mb-3">
        <button
          className="btn btn-success w-100 mb-2"
          onClick={generatePassword}
        >
          Generate Password
        </button>

        {password && (
          <div className="d-flex border rounded p-2 justify-content-between align-items-center bg-white">
            <span className="me-2 text-break" style={{ wordBreak: 'break-word' }}>
              {password}
            </span>
            {!password.startsWith("❌") && (
              <button className="btn btn-sm btn-outline-primary" onClick={handleCopy}>
                {copied ? 'Copied!' : 'Copy'}
              </button>
            )}
          </div>
        )}
      </div>

      <button
        className="btn btn-outline-primary w-100"
        disabled={password.startsWith("❌") || !password}
        onClick={() => onUsePassword(password)}
      >
        Use this password
      </button>
    </div>
  );
};

export default PasswordGenerator;
