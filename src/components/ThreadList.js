import React from "react";
import Thread from "./Thread";
const ThreadList = ({ threads }) => {
  if (!threads) return null;
  return (
    <div className="py-6 divide-y">
      {threads.map((thread, key) => (
        <Thread thread={thread} key={key} />
      ))}
    </div>
  );
};

export default ThreadList;
