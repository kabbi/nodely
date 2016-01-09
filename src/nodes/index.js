const localNodes = exports.nodes = {
  'json-stringify@1.0.0': require('./JsonStringifyNode'),
  'http-server@1.0.0': require('./HttpServerNode'),
  'javascript@1.0.0': require('./JavascriptNode'),
  'tcp-server@1.0.0': require('./TcpServerNode'),
  'timer@1.0.0': require('./TimerNode'),
  'stdio@1.0.0': require('./StdioNode')
};

exports.createNode = (nodeData) => {
  const Node = localNodes[nodeData.type];
  if (!Node) {
    return Promise.reject(new Error('Node type is not supported'));
  }
  return Promise.resolve(new Node(nodeData.id, nodeData.props));
};
