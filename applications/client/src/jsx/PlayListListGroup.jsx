var React = require('react');

class PlayListListGroup extends React.Component {

    constructor(props) {
        super(props);
        this.state = {playlist: props.playLists};
    }

    render() {

        return (

            <div className={"playlistlistgroup"}>
                <ul className="list-group list-group-flush">
                    {
                        this.state.playlist.map(function (object, i) {
                            return (<li className={"list-group-item"} key={object.name}> {object.name} </li>);
                        })

                    }


                </ul>
            </div>);
        


    }


}


module.exports = PlayListListGroup;