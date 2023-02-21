import React from "react";
import { connect } from "react-redux";
import { ContainerNarrow, Tabs, TabsLink, ViewHeader, ViewHeaderTitle } from "../../base";
import { routerLocationHasState } from "../../utils/utils";
import EmptyReference from "./Empty";
import ImportReference from "./Import";

export class AddReference extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            lock: false
        };
    }

    componentDidUpdate(prevProps) {
        if (this.props.show !== prevProps.show) {
            this.setState({ show: this.props.show });
        }
    }

    checkActive = current => () => this.props[current];

    checkModalLock = isLocked => {
        if (isLocked) {
            return this.setState({ lock: true });
        }
        this.setState({ lock: false });
    };

    handleHide = () => {
        if (!this.state.lock) {
            this.props.onHide();
        }
    };

    renderForm = () => {
        if (this.props.isImport) {
            return <ImportReference lock={this.checkModalLock} />;
        }

        return <EmptyReference />;
    };

    render() {
        return (
            <ContainerNarrow>
                <ViewHeader title="Create Reference">
                    <ViewHeaderTitle>Create Reference</ViewHeaderTitle>
                </ViewHeader>
                <Tabs>
                    <TabsLink
                        to={{ state: { newReference: true, emptyReference: true } }}
                        isActive={this.checkActive("isCreate")}
                    >
                        Empty
                    </TabsLink>
                    <TabsLink
                        to={{ state: { newReference: true, importReference: true } }}
                        isActive={this.checkActive("isImport")}
                    >
                        Import
                    </TabsLink>
                </Tabs>

                {this.renderForm()}
            </ContainerNarrow>
        );
    }
}

const mapStateToProps = state => {
    const isCreate = routerLocationHasState(state, "emptyReference");
    const isImport = routerLocationHasState(state, "importReference");
    return {
        isCreate,
        isImport
    };
};

export default connect(mapStateToProps)(AddReference);
