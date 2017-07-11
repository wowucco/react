;'use strict';

window.ee = new EventEmitter();

class Article extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            visible: false
        };
        this.readmoreClick = this.readmoreClick.bind(this);
    }
    readmoreClick(e) {
        e.preventDefault();
        this.setState({visible:true});
    }
    render() {
        return (
            <div className="article">
                <p className="news__author">{this.props.item.author}</p>
                <p className="news__text">{this.props.item.text}</p>
                <p className={'news__big-text ' + (this.state.visible ? '': 'none')}>{this.props.item.bigText}</p>
                <a
                    onClick={this.readmoreClick} href="#" className={'news__readmore ' + (this.state.visible ? 'none': '') }>
                    read more
                </a>
            </div>
        );
    }
}
Article.propTypes = {
    item: React.PropTypes.object.isRequired
   /* item: React.PropTypes.shape({
        author: React.PropTypes.string,
        text: React.PropTypes.string
    })*/
};

class News extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        var news;
        if (this.props.data.length > 0) {
            news = this.props.data.map((item, index) => {
                return (
                    <div key={index}>
                        <Article item={item} />
                    </div>
                );
            });
        } else {
            news = <p>News dont existing</p>
        }
        return (
            <div className="news">
                {news}
                <strong
                    className={'news__count ' + (this.props.data.length	>	0	?	'':'none')}>
                    Всего	новостей:	{this.props.data.length}
                </strong>
            </div>
        );
    }
}
News.propTypes = {
    data: React.PropTypes.array.isRequired
};

class Add extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            agreeNotChange: true,
            authorIsEmpty: true,
            textIsEmpty: true
        };
        this.onBtnClickHandler = this.onBtnClickHandler.bind(this);
        this.onCheckRuleClick = this.onCheckRuleClick.bind(this);
        this.onFieldChange = this.onFieldChange.bind(this);
    }
    componentDidMount() {
        ReactDOM.findDOMNode(this.refs.author).focus();
    }
    onCheckRuleClick() {
        this.setState({
            agreeNotChange: !this.state.agreeNotChange
        });
    }
    onBtnClickHandler(e) {
        e.preventDefault();
        let author = ReactDOM.findDOMNode(this.refs.author).value;
        let text = ReactDOM.findDOMNode(this.refs.text);
        let item = [{
            author: author,
            text: text.value
        }];
        window.ee.emit('News.add', item);
        text.value = '';
        this.setState({textIsEmpty: true});
        ReactDOM.findDOMNode(this.refs.text).focus();
    }
    onFieldChange(fieldName, e) {
        if (e.target.value.trim().length >0) {
            this.setState({[fieldName]: false});
        } else {
            this.setState({[fieldName]: true});
        }
    }
    render() {
        return (
            <div>
                <form className="add cf">
                    <input
                        type="text"
                        className="add__author"
                        defaultValue=''
                        ref='author'
                        placeholder="author"
                        onChange={this.onFieldChange.bind(this, 'authorIsEmpty')} />
                    <textarea
                        className="add__text"
                        defaultValue=''
                        placeholder="Enter text"
                        ref="text"
                        onChange={this.onFieldChange.bind(this, 'textIsEmpty')}
                    ></textarea>
                    <label className="add__checkrule">
                        <input
                            type="checkbox"
                            defaultChecked={false}
                            ref="checkrule"
                            onChange={this.onCheckRuleClick} />
                        I accept the terms
                    </label>
                    <button
                        className="add__btn"
                        disabled={this.state.authorIsEmpty || this.state.textIsEmpty || this.state.agreeNotChange}
                        onClick={this.onBtnClickHandler}
                        ref='btn'
                    >Create</button>
                </form>
            </div>
        );
    }
}

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: this.props.data
        }
    }
    componentDidMount() {
        window.ee.addListener('News.add', item => {
            let newNews = item.concat(this.state.data);
            this.setState({data: newNews});
        });
    }
    componentWillUnmount() {
        window.removeListener('News.add');
    }
    render() {
        return (
            <div className="app">
                <h3>News</h3>
                <Add />
                <News data={this.state.data}/>
            </div>
        );
    }
}
var	my_news	=	[
    {
        author:	'Саша	Печкин',
        text:	'В	четчерг,	четвертого	числа...',
        bigText: 'в	четыре	с	четвертью	часа	четыре	чёрненьких	чумазеньких	чертёнка	чертили чёрными	чернилами	чертёж.'
    },
    {
        author:	'Просто	Вася',
        text:	'Считаю,	что	$	должен	стоить	35	рублей!',
        bigText:	'А	евро	42!'
    },
    {
        author:	'Гость',
        text:	'Бесплатно.	Скачать.	Лучший	сайт	-	http://localhost:3000',
        bigText:	'На	самом	деле	платно,	просто	нужно	прочитать	очень	длинное	лицензионное соглашение'
    }
];
ReactDOM.render(
    <App data={my_news} />,
    document.getElementById('root')
);