import React, { Component } from "react";
import Loading from "./Loading";
import Panel from "./Panel";
import classnames from "classnames";
import { getTotalPhotos, getTotalTopics, getUserWithLeastUploads, getUserWithMostUploads } from "helpers/selectors";

const data = [
  {
    id: 1,
    label: "Total Photos",
    getValue: getTotalPhotos,
  },
  {
    id: 2,
    label: "Total Topics",
    getValue: getTotalTopics,
  },
  {
    id: 3,
    label: "User with the most uploads",
    getValue: getUserWithMostUploads,
  },
  {
    id: 4,
    label: "User with the least uploads",
    getValue: getUserWithLeastUploads,
  },
];

class Dashboard extends Component {
  state = {
    loading: true,
    focused: null,
    photos: [],
    topics: [],
  };

  selectPanel(id) {
    this.setState((prevState) => ({
      focused: prevState.focused !== null ? null : id,
    }));
  }

  componentDidMount() {
    const focused = JSON.parse(localStorage.getItem("focused"));

    if (focused) {
      this.setState({ focused });
    }

    const urlsPromise = ["/api/photos", "/api/topics"].map((url) =>
      fetch(url).then((response) => response.json())
    );

    Promise.all(urlsPromise).then(([photos, topics]) => {
      this.setState({
        loading: false,
        photos: photos,
        topics: topics,
      });
    });
  }

  componentDidUpdate(previousProps, previousState) {
    if (previousState.focused !== this.state.focused) {
      localStorage.setItem("focused", JSON.stringify(this.state.focused));
    }
  }

  render() {
    const dashboardClasses = classnames("dashboard", {
      "dashboard--focused": this.state.focused,
    });

    if (this.state.loading) {
      return <Loading />;
    }

    const panels = (
      this.state.focused
        ? data.filter((panel) => this.state.focused === panel.id)
        : data
    ).map((panel) => (
      <Panel
        value={panel.getValue(this.state)}
        label={panel.label}
        key={panel.id}
        selectPanel={() => this.selectPanel(panel.id)}
      />
    ));

    return <main className={dashboardClasses}>{panels}</main>;
  }
}

export default Dashboard;
