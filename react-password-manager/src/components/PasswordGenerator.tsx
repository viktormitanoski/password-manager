import React, { useState, useEffect } from 'react';

const PasswordGenerator: React.FC = () => {
  const [passwordLength, setPasswordLength] = useState(12);
  const [includeUppercase, setIncludeUppercase] = useState(true);
  const [includeLowercase, setIncludeLowercase] = useState(true);
  const [includeNumbers, setIncludeNumbers] = useState(true);
  const [includeSymbols, setIncludeSymbols] = useState(true);
  const [password, setPassword] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    generatePassword(passwordLength);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [passwordLength]);

  const generatePassword = (length: number) => {
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
    for (let i = 0; i < length; i++) {
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
    <div
      className="d-flex justify-content-center align-items-center min-vh-100"
      style={{ background: 'linear-gradient(to right, #e0f7fa, #ffffff)' }}
    >
      <div className="card p-4 shadow-lg" style={{ maxWidth: '500px', width: '100%', borderRadius: '16px' }}>
        <h2 className="text-center mb-4" style={{ color: '#00796b' }}>
          🔐 Customize your password
        </h2>

        <div className="mb-3">
          <label className="form-label">Password Length: {passwordLength}</label>
          <input
            type="range"
            className="form-range"
            min={6}
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
              onChange={(e) => {
                setIncludeUppercase(e.target.checked);
                generatePassword(passwordLength);
              }}
              id="uppercaseCheck"
            />
            <label className="form-check-label" htmlFor="uppercaseCheck">
              Uppercase
            </label>
          </div>

          <div className="form-check">
            <input
              type="checkbox"
              className="form-check-input"
              checked={includeLowercase}
              onChange={(e) => {
                setIncludeLowercase(e.target.checked);
                generatePassword(passwordLength);
              }}
              id="lowercaseCheck"
            />
            <label className="form-check-label" htmlFor="lowercaseCheck">
              Lowercase
            </label>
          </div>

          <div className="form-check">
            <input
              type="checkbox"
              className="form-check-input"
              checked={includeNumbers}
              onChange={(e) => {
                setIncludeNumbers(e.target.checked);
                generatePassword(passwordLength);
              }}
              id="numbersCheck"
            />
            <label className="form-check-label" htmlFor="numbersCheck">
              Numbers
            </label>
          </div>

          <div className="form-check">
            <input
              type="checkbox"
              className="form-check-input"
              checked={includeSymbols}
              onChange={(e) => {
                setIncludeSymbols(e.target.checked);
                generatePassword(passwordLength);
              }}
              id="symbolsCheck"
            />
            <label className="form-check-label" htmlFor="symbolsCheck">
              Symbols
            </label>
          </div>
        </div>

        <div className="mb-3">
          <button
            className="btn btn-success w-100 mb-3 rounded-pill fw-bold"
            onClick={() => generatePassword(passwordLength)}
          >
            Generate Password
          </button>

          <div className="d-flex border rounded p-2 justify-content-between align-items-center bg-light">
            <span className="me-2 text-break" style={{ wordBreak: 'break-all' }}>
              {password || 'Your password will appear here...'}
            </span>
            {password && !password.startsWith('❌') && (
              <button className="btn btn-sm btn-outline-primary" onClick={handleCopy}>
                {copied ? 'Copied!' : 'Copy'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PasswordGenerator;
