import React from 'react';
import './index.css'
import './monitor.css';
import ReactMarkdown from 'react-markdown'
import options from "./options.md"

class Options extends React.Component {

    constructor(props) {
        super(props);

        this.waveTypes = {
            "afib": "Atrial Fibrillation",
            "aflutter":"Atrial Flutter",
            "third-degree":"Third Degree AV Nodal Block",
        }
        this.state = {
            options: JSON.stringify(this.props.defaultOptions, undefined, 2),
            pluginCode: "",
        }

        this.handleClick = this.handleClick.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.formatPluginCode = this.formatPluginCode.bind(this);
    }

    formatPluginCode() {
        let baseUrl = window.location.origin
        var code = "<div id=\"monitor\" class=\"monitor no-cpu\"></div>"
        code += "<script type=\"module\" src=\""+baseUrl+"/plugin/d3monitor-beta.min.js\"></script><script>window.onload = function() {  var options="
        code += this.state.options + ";var D3MONITOR = new window.d3monitor(\"monitor\",options);D3MONITOR.initialize()};</script>"
        code = code.replace(/  +/g, ' ');

        return code
    }

    handleClick(){
        this.props.setOptions(JSON.parse(this.state.options))
    }

    handleChange(event) {
        this.setState({ options: event.target.value });
    }

    componentWillMount() {
    fetch(options).then((response) => response.text()).then((text) => {
      this.setState({ terms: text })
    })
  }

    render() {

        const hr = Array.from({ length: 130 }, (v, k) => k + 51)
        const tracingOptions = ["afib", "sinus", "aflutter", "third-degree", "pleth"]

        return (
            
            <div className="options">
                <div className="options-left">
                    <h3>Options</h3>
                        <textarea className="options-textarea" onChange={this.handleChange} value={this.state.options} />
                        <div onClick={this.handleClick} className="update-button">Update Display</div>
                        <p>Items will update next cycle (5-10 seconds)</p>
                    <h3>Plugin Code</h3>
                        <code><input width="100%" value={this.formatPluginCode()}/></code>
                </div>
                <div className="options-right">
                    <ReactMarkdown source={this.state.terms} />
                </div>
              </div>

        );
    }
}
export default Options