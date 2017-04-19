//
require('./assets/style.scss')
const React = require('react')
const DOMPurify = require('purify')
const ReactDOM = require('react-dom')
const marked = require('marked')


class MarkdownEditor extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      text: "# Markdown",
      showMarkdown: true,
      showSplit: window.innerWidth > 600,
    }
    this.mediaQuery = null;
    this.handleMediaQuery = this.handleMediaQuery.bind(this);
    this.toggleViewer = this.toggleViewer.bind(this);
    this.convertMarkdown = this.convertMarkdown.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }
  
  componentDidMount() {
    this.mediaQuery = window.matchMedia("(min-width: 600px)");
    this.mediaQuery.addListener(this.handleMediaQuery);
  }
  
  componentWillUnmount() {
    this.mediaQuery.removeListener(this.handleMediaQuery);
  }
  
  handleMediaQuery(mql) {
    if (mql.matches) {
      this.setState({
        showSplit: true
      });
    } else {
      this.setState({
        showSplit: false
      });
    }
  }
  
  toggleViewer() {
    this.setState((prev,) => ({showMarkdown: !prev.showMarkdown}));
  }
  
  handleChange(event) {
    this.setState({
      text: event.target.value
    });
  }
  
  convertMarkdown() {
    return {
      __html: DOMPurify.sanitize(marked(this.state.text))
    };
  }
  
  render() {
    const {showMarkdown, showSplit, text} = this.state;
    let previewStyle = {display: 'none'};
    let markdownStyle = {};
    let menuStyle = {};
    let buttonText = "preview";
    if (showMarkdown) {
      markdownStyle = {display: 'none'};
      previewStyle = {};
      buttonText = "markdown"
    }
    if (showSplit) {
      menuStyle = {display: 'none'};
      previewStyle = {};
      markdownStyle = {};
    }

    return <div className="c-markdown-editor">
        <div className="c-markdown-editor__menu full" style={menuStyle}>
          <ToggleButton className="c-markdown-editor__menu__toggle-button"
            onClick={this.toggleViewer} buttonText={buttonText}/>
        </div>
        <MarkdownInput onChange={this.handleChange} value={text}
          className="c-markdown-editor__input cell" style={markdownStyle}/>
        <div className="c-markdown-editor__previewer cell"
          dangerouslySetInnerHTML={this.convertMarkdown()} style={previewStyle}>
        </div>
      </div>
  }
}

const ToggleButton = ({className, onClick, buttonText}) =>
  <button type="button" className="c-markdown-editor__menu__toggle-button"
    onClick={onClick} href="#">Toggle {buttonText}</button>;

const MarkdownInput = ({value, onChange, style, className}) =>
     <textarea value={value} onChange={onChange}
       className={className} style={style}/>;

ReactDOM.render(<MarkdownEditor/>, document.getElementById("container"));
