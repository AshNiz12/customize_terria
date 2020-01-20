import React from "react";

import createReactClass from "create-react-class";

import PropTypes from "prop-types";

import knockout from "terriajs-cesium/Source/ThirdParty/knockout";
import ObserveModelMixin from "terriajs/lib/ReactViews/ObserveModelMixin";
import SearchBox from "terriajs/lib/ReactViews/Search/SearchBox.jsx";
import SidebarSearch from "terriajs/lib/ReactViews/Search/SidebarSearch.jsx";
import Workbench from "terriajs/lib/ReactViews/Workbench/Workbench.jsx";
import Icon from "terriajs/lib/ReactViews/Icon.jsx";
import FullScreenButton from "terriajs/lib/ReactViews/SidePanel/FullScreenButton.jsx";
import { removeMarker } from "terriajs/lib/Models/LocationMarkerUtils";
import getReactElementFromContents from "terriajs/lib/ReactViews/ReactHelpers/getReactElementFromContents";

import Styles from "terriajs/lib/ReactViews/SidePanel/side-panel.scss";

const SideBar = createReactClass({
  displayName: "SideBar",
  mixins: [ObserveModelMixin],

  propTypes: {
    terria: PropTypes.object.isRequired,
    viewState: PropTypes.object.isRequired
  },

  componentDidMount() {
    this.subscribeToProps();
  },

  componentDidUpdate() {
    this.subscribeToProps();
  },

  componentWillUnmount() {
    this.unsubscribeFromProps();
  },

  subscribeToProps() {
    this.unsubscribeFromProps();

    // Close the search results when the Now Viewing changes (so that it's visible).
    this._nowViewingChangeSubscription = knockout
      .getObservable(this.props.terria.nowViewing, "items")
      .subscribe(() => {
        this.props.viewState.searchState.showLocationSearchResults = false;
      });
  },

  unsubscribeFromProps() {
    if (this._nowViewingChangeSubscription) {
      this._nowViewingChangeSubscription.dispose();
      this._nowViewingChangeSubscription = undefined;
    }
  },

  onAddDataClicked(event) {
    event.stopPropagation();
    this.props.viewState.topElement = "AddData";
    this.props.viewState.openAddData();
  },

  onAddLocalDataClicked() {
    this.props.viewState.openUserData();
  },

  changeSearchText(newText) {
    this.props.viewState.searchState.locationSearchText = newText;

    if (newText.length === 0) {
      removeMarker(this.props.terria);
    }
  },

  search() {
    this.props.viewState.searchState.searchLocations();
  },

  startLocationSearch() {
    this.props.viewState.searchState.showLocationSearchResults = true;
  },

  render() {
    const searchState = this.props.viewState.searchState;
    const emptyWorkbenchValue = this.props.terria.language[
      "EmptyWorkbenchMessage"
    ];
    const emptyWorkbench = getReactElementFromContents(emptyWorkbenchValue);

    return (
      <div className={Styles.workBench}>
        <div className={Styles.header}>
          <FullScreenButton
            terria={this.props.terria}
            viewState={this.props.viewState}
            minified={true}
            animationDuration={250}
            btnText="Hide"
          />

          <SearchBox
            onSearchTextChanged={this.changeSearchText}
            onDoSearch={this.search}
            onFocus={this.startLocationSearch}
            searchText={searchState.locationSearchText}
            placeholder="Search for locations"
          />
          <div className={Styles.addData}>
            <button
              type="button"
              onClick={this.onAddDataClicked}
              className={Styles.button}
              title={this.props.terria.language.AddDataBtnText}
            >
              <Icon glyph={Icon.GLYPHS.add} />
              {getReactElementFromContents(
                this.props.terria.language.AddDataBtnText
              )}
            </button>
            <button
              type="button"
              onClick={this.onAddLocalDataClicked}
              className={Styles.uploadData}
              title="Load local/web data"
            >
              <Icon glyph={Icon.GLYPHS.upload} />
            </button>
          </div>
        </div>
        <div className={Styles.body}>
          <Choose>
            <When
              condition={
                searchState.locationSearchText.length > 0 &&
                searchState.showLocationSearchResults
              }
            >
              <SidebarSearch
                terria={this.props.terria}
                viewState={this.props.viewState}
                isWaitingForSearchToStart={
                  searchState.isWaitingToStartLocationSearch
                }
              />
            </When>
          </Choose>
          <div style={{color: "#FFFFFF"}}>
            <p>Following are the items will be listed after data import</p>
            <ul>
                <li>Item 1</li>
                <li>Item 2</li>
                <li>Item 3</li>
                <li>Item 4</li>
                <li>Item 5</li>
            </ul>
          </div>
        </div>
      </div>
    );
  }
});

module.exports = SideBar;
