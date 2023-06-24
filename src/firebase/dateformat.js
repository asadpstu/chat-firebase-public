import React from 'react';
import moment from 'moment';

const DateTimeFormat = ({ timestamp }) => {
  const currentTime = new Date();
  const postTime = new Date(timestamp);
  const diffInMinutes = Math.floor((currentTime - postTime) / (1000 * 60));

  let formattedDateTime;
  if (diffInMinutes < 5) {
    formattedDateTime = moment(postTime).fromNow();
  }
  else if (diffInMinutes < 30) {
    formattedDateTime = moment(postTime).format('h:MM A');
  }
  else if (diffInMinutes > 525600) {
    formattedDateTime = moment(postTime).format('h:mm:ss a Do MMMM YY');
  }
  else {
    formattedDateTime = moment(postTime).format('D MMM h:mm A');
  }
  return <span>{formattedDateTime}</span>;
};

export default DateTimeFormat;