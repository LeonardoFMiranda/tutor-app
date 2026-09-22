const React = require('react');
const ReactDOMServer = require('react-dom/server');
const { useChat } = require('@ai-sdk/react');

global.fetch = async (url, options) => {
  console.log("FETCH URL:", url);
  console.log("FETCH BODY:", options.body);
  return {
    ok: true,
    body: { getReader: () => ({ read: async () => ({ done: true }) }) },
    headers: new Map()
  };
};

function Test() {
  const chat = useChat({ api: '/api/chat', body: { conversationId: '12345' } });
  
  React.useEffect(() => {
    chat.sendMessage({ text: 'hello' }).catch(e => console.error("Err", e));
  }, []);
  
  return null;
}

try {
  ReactDOMServer.renderToString(React.createElement(Test));
} catch(e) {
  // useEffect won't run in renderToString. 
}
