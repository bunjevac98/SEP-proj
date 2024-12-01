export const handleLogin = async (data) => {
    try {
        return { status: 404, message: "No api route set" }
    } catch (e) {
        console.error(e);
        return (e?.message || e);
    }
}

export const handleRegister = async (data) => {
    try {
        return {
            status: 200,
            message: "Success",
            data: {
                merchantId: 23987492384,
                username: data.username,
                password: (data.password.substr(0, 1) + "*****"),
            }
        }
        return { status: 404, message: "No api route set" }
    } catch (e) {
        console.error(e);
        return (e?.message || e);
    }
}

export const copyToClipboard = (content) => {

    if (navigator?.clipboard) {
      // Use the modern Clipboard API
      navigator.clipboard
        .writeText(content)
        .then(() => {
          alert('Copied to clipboard!');
        })
        .catch(() => {
          alert('Failed to copy the link. Please try again.');
        });
    } else {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = content;

      textArea.style.position = 'fixed';
      textArea.style.width = '0';
      textArea.style.height = '0';

      document.body.appendChild(textArea);
      textArea.select();
      try {
        const successful = document.execCommand('copy');
        if (successful) {
          alert('Copied to clipboard!');
        } else {
          alert('Failed to copy this. Please try again.');
        }
          } catch (err) {
        alert('Failed to copy this. Please try again.');
      }
      document.body.removeChild(textArea);
    }
  };


  export const formatToDecimal = (input) => {
    // Convert the input to a number
    const number = parseFloat(input);
  
    // Check if it's a valid number
    if (!isNaN(number)) {
      // If it's a whole number, add ".00"
      if (Number.isInteger(number)) {
        return number.toFixed(2);
      }
      // If it's already a decimal number, return as is
      return input;
    }
  
    // Return null or an appropriate value for invalid input
    return null;
  };
  