import React, { useEffect, useState } from "react";
import { Tree, TreeNode } from "react-organizational-chart";
import ball from "../../assets/photos/ball2.png";
import { GetTree, GetUserDetails } from "../../Controllers/User/UserController";
import { Link, useLocation } from "react-router-dom";
import { Loading3 } from "../Loading1";

const styles = {
  node: {
    padding: "2px",
    borderRadius: "200px",
    display: "inline-block",
    position: "relative",
  },
  text: {
    position: "absolute",
    // top: "100%",
    left: "50%",
    transform: "translateX(-50%)",
    rotate: "270deg",
    textAlign: "center",
    fontWeight: 600,
  },
};

const renderTreeNode = (node) => (
  <TreeNode
    label={
      <div
        style={styles.node}
        className="mb-6 border-black  dark:border-white  border-dotted  border-2"
      >
        <img alt="ball" src={ball} className="w-6 h-6 " />
        <Link
          style={styles.text}
          className="dark:text-gray-200 text-xs cursor-pointer rotate-[200deg] -ml-5"
          to={{
            pathname: "/home",
            search: `?network=member-tree&uid=${node.uid}`,
          }}
        >
          {node.name?.split(" ")[0]}
        </Link>
      </div>
    }
  >
    {node.children && node.children.map((child) => renderTreeNode(child))}
  </TreeNode>
);

export default function MemberTree() {
  const location = useLocation();
  const [data, setData] = useState(null);
  const [loading, setloading] = useState(true);
  const [user, setUser] = useState();
  const [userLoading, setUserLoading] = useState(true);

  // Function to fetch data based on uid
  const fetchData = async (uid) => {
    try {
      const response = await GetTree(uid);
      const buildTree = (users) => {
        const tree = {
          Root: null,
          Left: null,
          Right: null,
        };

        // Initialize the root
        tree.Root = users[0];

        const addNode = (parent, node) => {
          if (!parent.Child) {
            parent.Child = [null, null]; // Initialize child slots
          }

          const positionIndex = node.position === "L" ? 0 : 1;

          // Check if we can add directly to the parent's children
          if (!parent.Child[positionIndex]) {
            parent.Child[positionIndex] = node;
          } else {
            // Recursively try to add to the children
            addNode(parent.Child[positionIndex], node);
          }
        };

        const findParentAndAdd = (node) => {
          const searchInTree = (currentNode) => {
            if (!currentNode) return false;
            // Check if the current node can be a parent
            if (currentNode.reffer_code === node.reffer_by) {
              addNode(currentNode, node);
              return true;
            }
            // Search in children
            if (currentNode.Child) {
              return (
                searchInTree(currentNode.Child[0]) ||
                searchInTree(currentNode.Child[1])
              );
            }
            return false;
          };

          // Try to find where to add the new node
          return searchInTree(tree.Root);
        };

        // Add the rest of the users
        for (let i = 1; i < users.length; i++) {
          if (!findParentAndAdd(users[i])) {
            // If no parent found, add in first vacant Left or Right position
            if (!tree.Left) {
              tree.Left = users[i];
            } else if (!tree.Right) {
              tree.Right = users[i];
            }
          }
        }

        // Enforce the structure: each child can have max 2 grandchildren
        const enforceStructure = (node) => {
          if (!node) return;

          if (!node.Child) {
            node.Child = [null, null]; // Ensure Child array exists
          }

          const [leftChild, rightChild] = node.Child;

          if (leftChild) enforceStructure(leftChild);
          if (rightChild) enforceStructure(rightChild);

          // Limit to max 4 grandchildren (2 for each child)
          const leftGrandchildren = leftChild?.Child
            ? leftChild.Child.filter(Boolean)
            : [];
          const rightGrandchildren = rightChild?.Child
            ? rightChild.Child.filter(Boolean)
            : [];

          // Ensure each child has exactly 2 slots
          if (leftChild) {
            leftChild.Child = leftGrandchildren.slice(0, 2); // Keep only up to 2 grandchildren
            while (leftChild.Child.length < 2) {
              leftChild.Child.push({}); // Add empty objects if needed
            }
          }
          if (rightChild) {
            rightChild.Child = rightGrandchildren.slice(0, 2); // Keep only up to 2 grandchildren
            while (rightChild.Child.length < 2) {
              rightChild.Child.push({}); // Add empty objects if needed
            }
          }
        };

        enforceStructure(tree.Root);

        return tree;
      };

      const result = buildTree(response.data);
      const stringifyData = JSON.stringify(result, null, 2);
      setData(JSON.parse(stringifyData));
      setloading(false);
    } catch (error) {
      setloading(false);
      setData([]);
    }
  };

  const getChildByPosition = (children, position) => {
    if (!Array.isArray(children)) return null;

    // Filter out null values and then find the child by position
    const validChildren = children.filter((child) => child !== null);
    return validChildren.find((item) => item.position === position) || null;
  };

  const getNestedChild = (root, ...positions) => {
    let current = root;

    for (const pos of positions) {
      if (!current || !current.Child) {
        return {}; // Return an empty object if current is null or if Child is not present
      }

      current = getChildByPosition(current.Child, pos);
      if (!current) {
        return {}; // Return an empty object if no child found at the position
      }
    }

    return current; // Return the current object if found
  };

  const familyData = {
    name: data?.Root?.username || "",
    uid: data?.Root?.uid || "",
    children: [
      {
        name: getNestedChild(data?.Root, "L")?.username || "",
        uid: getNestedChild(data?.Root, "L")?.uid || "",
        children: [
          {
            name: getNestedChild(data?.Root, "L", "L")?.username || "",
            uid: getNestedChild(data?.Root, "L", "L")?.uid || "",
            children: [
              {
                name: getNestedChild(data?.Root, "L", "L", "L")?.username || "",
                uid: getNestedChild(data?.Root, "L", "L", "L")?.uid || "",
                children: [
                  {
                    name:
                      getNestedChild(data?.Root, "L", "L", "L", "L")
                        ?.username || "",
                    uid:
                      getNestedChild(data?.Root, "L", "L", "L", "L")?.uid || "",
                    children: [
                      {
                        name:
                          getNestedChild(data?.Root, "L", "L", "L", "L", "L")
                            ?.username || "",
                        uid:
                          getNestedChild(data?.Root, "L", "L", "L", "L", "L")
                            ?.uid || "",
                      },
                      {
                        name:
                          getNestedChild(data?.Root, "L", "L", "L", "L", "R")
                            ?.username || "",
                        uid:
                          getNestedChild(data?.Root, "L", "L", "L", "L", "R")
                            ?.uid || "",
                      },
                    ],
                  },
                  {
                    name:
                      getNestedChild(data?.Root, "L", "L", "L", "R")
                        ?.username || "",
                    uid:
                      getNestedChild(data?.Root, "L", "L", "L", "R")?.uid || "",
                    children: [
                      {
                        name:
                          getNestedChild(data?.Root, "L", "L", "L", "R", "L")
                            ?.username || "",
                        uid:
                          getNestedChild(data?.Root, "L", "L", "L", "R", "L")
                            ?.uid || "",
                      },
                      {
                        name:
                          getNestedChild(data?.Root, "L", "L", "L", "R", "R")
                            ?.username || "",
                        uid:
                          getNestedChild(data?.Root, "L", "L", "L", "R", "R")
                            ?.uid || "",
                      },
                    ],
                  },
                ],
              },
              {
                name: getNestedChild(data?.Root, "L", "L", "R")?.username || "",
                uid: getNestedChild(data?.Root, "L", "L", "R")?.uid || "",
                children: [
                  {
                    name:
                      getNestedChild(data?.Root, "L", "L", "R", "L")
                        ?.username || "",
                    uid:
                      getNestedChild(data?.Root, "L", "L", "R", "L")?.uid || "",
                    children: [
                      {
                        name:
                          getNestedChild(data?.Root, "L", "L", "R", "L", "L")
                            ?.username || "",
                        uid:
                          getNestedChild(data?.Root, "L", "L", "R", "L", "L")
                            ?.uid || "",
                      },
                      {
                        name:
                          getNestedChild(data?.Root, "L", "L", "R", "L", "R")
                            ?.username || "",
                        uid:
                          getNestedChild(data?.Root, "L", "L", "R", "L", "R")
                            ?.uid || "",
                      },
                    ],
                  },
                  {
                    name:
                      getNestedChild(data?.Root, "L", "L", "R", "R")
                        ?.username || "",
                    uid:
                      getNestedChild(data?.Root, "L", "L", "R", "R")?.uid || "",
                    children: [
                      {
                        name:
                          getNestedChild(data?.Root, "L", "L", "R", "R", "L")
                            ?.username || "",
                        uid:
                          getNestedChild(data?.Root, "L", "L", "R", "R", "L")
                            ?.uid || "",
                      },
                      {
                        name:
                          getNestedChild(data?.Root, "L", "L", "R", "R", "R")
                            ?.username || "",
                        uid:
                          getNestedChild(data?.Root, "L", "L", "R", "R", "R")
                            ?.uid || "",
                      },
                    ],
                  },
                ],
              },
            ],
          },
          {
            name: getNestedChild(data?.Root, "L", "R")?.username || "",
            uid: getNestedChild(data?.Root, "L", "R")?.uid || "",
            children: [
              {
                name: getNestedChild(data?.Root, "L", "R", "L")?.username || "",
                uid: getNestedChild(data?.Root, "L", "R", "L")?.uid || "",
                children: [
                  {
                    name:
                      getNestedChild(data?.Root, "L", "R", "L", "L")
                        ?.username || "",
                    uid:
                      getNestedChild(data?.Root, "L", "R", "L", "L")?.uid || "",
                    children: [
                      {
                        name:
                          getNestedChild(data?.Root, "L", "R", "L", "L", "L")
                            ?.username || "",
                        uid:
                          getNestedChild(data?.Root, "L", "R", "L", "L", "L")
                            ?.uid || "",
                      },
                      {
                        name:
                          getNestedChild(data?.Root, "L", "R", "L", "L", "R")
                            ?.username || "",
                        uid:
                          getNestedChild(data?.Root, "L", "R", "L", "L", "R")
                            ?.uid || "",
                      },
                    ],
                  },
                  {
                    name:
                      getNestedChild(data?.Root, "L", "R", "L", "R")
                        ?.username || "",
                    uid:
                      getNestedChild(data?.Root, "L", "R", "L", "R")?.uid || "",
                    children: [
                      {
                        name:
                          getNestedChild(data?.Root, "L", "R", "L", "R", "L")
                            ?.username || "",
                        uid:
                          getNestedChild(data?.Root, "L", "R", "L", "R", "L")
                            ?.uid || "",
                      },
                      {
                        name:
                          getNestedChild(data?.Root, "L", "R", "L", "R", "R")
                            ?.username || "",
                        uid:
                          getNestedChild(data?.Root, "L", "R", "L", "R", "R")
                            ?.uid || "",
                      },
                    ],
                  },
                ],
              },
              {
                name: getNestedChild(data?.Root, "L", "R", "R")?.username || "",
                uid: getNestedChild(data?.Root, "L", "R", "R")?.uid || "",
                children: [
                  {
                    name:
                      getNestedChild(data?.Root, "L", "R", "R", "L")
                        ?.username || "",
                    uid:
                      getNestedChild(data?.Root, "L", "R", "R", "L")?.uid || "",
                    children: [
                      {
                        name:
                          getNestedChild(data?.Root, "L", "R", "R", "L", "L")
                            ?.username || "",
                        uid:
                          getNestedChild(data?.Root, "L", "R", "R", "L", "L")
                            ?.uid || "",
                      },
                      {
                        name:
                          getNestedChild(data?.Root, "L", "R", "R", "L", "R")
                            ?.username || "",
                        uid:
                          getNestedChild(data?.Root, "L", "R", "R", "L", "R")
                            ?.uid || "",
                      },
                    ],
                  },
                  {
                    name:
                      getNestedChild(data?.Root, "L", "R", "R", "R")
                        ?.username || "",
                    uid:
                      getNestedChild(data?.Root, "L", "R", "R", "R")?.uid || "",
                    children: [
                      {
                        name:
                          getNestedChild(data?.Root, "L", "R", "R", "R", "L")
                            ?.username || "",
                        uid:
                          getNestedChild(data?.Root, "L", "R", "R", "R", "L")
                            ?.uid || "",
                      },
                      {
                        name:
                          getNestedChild(data?.Root, "L", "R", "R", "R", "R")
                            ?.username || "",
                        uid:
                          getNestedChild(data?.Root, "L", "R", "R", "R", "R")
                            ?.uid || "",
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        name: getNestedChild(data?.Root, "R")?.username || "",
        uid: getNestedChild(data?.Root, "R")?.uid || "",
        children: [
          {
            name: getNestedChild(data?.Root, "R", "L")?.username || "",
            uid: getNestedChild(data?.Root, "R", "L")?.uid || "",
            children: [
              {
                name: getNestedChild(data?.Root, "R", "L", "L")?.username || "",
                uid: getNestedChild(data?.Root, "R", "L", "L")?.uid || "",
                children: [
                  {
                    name:
                      getNestedChild(data?.Root, "R", "L", "L", "L")
                        ?.username || "",
                    uid:
                      getNestedChild(data?.Root, "R", "L", "L", "L")?.uid || "",
                    children: [
                      {
                        name:
                          getNestedChild(data?.Root, "R", "L", "L", "L", "L")
                            ?.username || "",
                        uid:
                          getNestedChild(data?.Root, "R", "L", "L", "L", "L")
                            ?.uid || "",
                      },
                      {
                        name:
                          getNestedChild(data?.Root, "R", "L", "L", "L", "R")
                            ?.username || "",
                        uid:
                          getNestedChild(data?.Root, "R", "L", "L", "L", "R")
                            ?.uid || "",
                      },
                    ],
                  },
                  {
                    name:
                      getNestedChild(data?.Root, "R", "L", "L", "R")
                        ?.username || "",
                    uid:
                      getNestedChild(data?.Root, "R", "L", "L", "R")?.uid || "",
                    children: [
                      {
                        name:
                          getNestedChild(data?.Root, "R", "L", "L", "R", "L")
                            ?.username || "",
                        uid:
                          getNestedChild(data?.Root, "R", "L", "L", "R", "L")
                            ?.uid || "",
                      },
                      {
                        name:
                          getNestedChild(data?.Root, "R", "L", "L", "R", "R")
                            ?.username || "",
                        uid:
                          getNestedChild(data?.Root, "R", "L", "L", "R", "R")
                            ?.uid || "",
                      },
                    ],
                  },
                ],
              },
              {
                name: getNestedChild(data?.Root, "R", "L", "R")?.username || "",
                uid: getNestedChild(data?.Root, "R", "L", "R")?.uid || "",
                children: [
                  {
                    name:
                      getNestedChild(data?.Root, "R", "L", "R", "L")
                        ?.username || "",
                    uid:
                      getNestedChild(data?.Root, "R", "L", "R", "L")?.uid || "",
                    children: [
                      {
                        name:
                          getNestedChild(data?.Root, "R", "L", "R", "L", "L")
                            ?.username || "",
                        uid:
                          getNestedChild(data?.Root, "R", "L", "R", "L", "L")
                            ?.uid || "",
                      },
                      {
                        name:
                          getNestedChild(data?.Root, "R", "L", "R", "L", "R")
                            ?.username || "",
                        uid:
                          getNestedChild(data?.Root, "R", "L", "R", "L", "R")
                            ?.uid || "",
                      },
                    ],
                  },
                  {
                    name:
                      getNestedChild(data?.Root, "R", "L", "R", "R")
                        ?.username || "",
                    uid:
                      getNestedChild(data?.Root, "R", "L", "R", "R")?.uid || "",
                    children: [
                      {
                        name:
                          getNestedChild(data?.Root, "R", "L", "R", "R", "L")
                            ?.username || "",
                        uid:
                          getNestedChild(data?.Root, "R", "L", "R", "R", "L")
                            ?.uid || "",
                      },
                      {
                        name:
                          getNestedChild(data?.Root, "R", "L", "R", "R", "R")
                            ?.username || "",
                        uid:
                          getNestedChild(data?.Root, "R", "L", "R", "R", "R")
                            ?.uid || "",
                      },
                    ],
                  },
                ],
              },
            ],
          },
          {
            name: getNestedChild(data?.Root, "R", "R")?.username || "",
            uid: getNestedChild(data?.Root, "R", "R")?.uid || "",
            children: [
              {
                name: getNestedChild(data?.Root, "R", "R", "L")?.username || "",
                uid: getNestedChild(data?.Root, "R", "R", "L")?.uid || "",
                children: [
                  {
                    name:
                      getNestedChild(data?.Root, "R", "R", "L", "L")
                        ?.username || "",
                    uid:
                      getNestedChild(data?.Root, "R", "R", "L", "L")?.uid || "",
                    children: [
                      {
                        name:
                          getNestedChild(data?.Root, "R", "R", "L", "L", "L")
                            ?.username || "",
                        uid:
                          getNestedChild(data?.Root, "R", "R", "L", "L", "L")
                            ?.uid || "",
                      },
                      {
                        name:
                          getNestedChild(data?.Root, "R", "R", "L", "L", "R")
                            ?.username || "",
                        uid:
                          getNestedChild(data?.Root, "R", "R", "L", "L", "R")
                            ?.uid || "",
                      },
                    ],
                  },
                  {
                    name:
                      getNestedChild(data?.Root, "R", "R", "L", "R")
                        ?.username || "",
                    uid:
                      getNestedChild(data?.Root, "R", "R", "L", "R")?.uid || "",
                    children: [
                      {
                        name:
                          getNestedChild(data?.Root, "R", "R", "L", "R", "L")
                            ?.username || "",
                        uid:
                          getNestedChild(data?.Root, "R", "R", "L", "R", "L")
                            ?.uid || "",
                      },
                      {
                        name:
                          getNestedChild(data?.Root, "R", "R", "L", "R", "R")
                            ?.username || "",
                        uid:
                          getNestedChild(data?.Root, "R", "R", "L", "R", "R")
                            ?.uid || "",
                      },
                    ],
                  },
                ],
              },
              {
                name: getNestedChild(data?.Root, "R", "R", "R")?.username || "",
                uid: getNestedChild(data?.Root, "R", "R", "R")?.uid || "",
                children: [
                  {
                    name:
                      getNestedChild(data?.Root, "R", "R", "R", "L")
                        ?.username || "",
                    uid:
                      getNestedChild(data?.Root, "R", "R", "R", "L")?.uid || "",
                    children: [
                      {
                        name:
                          getNestedChild(data?.Root, "R", "R", "R", "L", "L")
                            ?.username || "",
                        uid:
                          getNestedChild(data?.Root, "R", "R", "R", "L", "L")
                            ?.uid || "",
                      },
                      {
                        name:
                          getNestedChild(data?.Root, "R", "R", "R", "L", "R")
                            ?.username || "",
                        uid:
                          getNestedChild(data?.Root, "R", "R", "R", "L", "R")
                            ?.uid || "",
                      },
                    ],
                  },
                  {
                    name:
                      getNestedChild(data?.Root, "R", "R", "R", "R")
                        ?.username || "",
                    uid:
                      getNestedChild(data?.Root, "R", "R", "R", "R")?.uid || "",
                    children: [
                      {
                        name:
                          getNestedChild(data?.Root, "R", "R", "R", "R", "L")
                            ?.username || "",
                        uid:
                          getNestedChild(data?.Root, "R", "R", "R", "R", "L")
                            ?.uid || "",
                      },
                      {
                        name:
                          getNestedChild(data?.Root, "R", "R", "R", "R", "R")
                            ?.username || "",
                        uid:
                          getNestedChild(data?.Root, "R", "R", "R", "R", "R")
                            ?.uid || "",
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  };

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const uid = queryParams.get("uid");

    if (uid) {
      fetchData(uid);
    }
  }, [location.search]);

  const userDetails = async () => {
    const response = await GetUserDetails();
    if (response !== null) {
      setUser(response[0]);
      setUserLoading(false);
    }
  };

  useEffect(() => {
    userDetails();
  }, []);

  if (loading || userLoading) {
    return (
      <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-gray-800 bg-opacity-50 z-[9999]">
        <Loading3 />
      </div>
    );
  }

  return (
    <div className="min-h-screen oveflow-scroll ">
      {/* <div className="tree-member-first-box flex flex-wrap  gap-16 border-2 border-black  dark:border-gray-400 rounded-lg  mb-6 p-2">
        <div className="">
          <p className="bg-[#ff9600] px-2 text-white rounded-lg">TARUN9742</p>
          <h1 className="font-bold text-xl dark:text-white">Left Team</h1>
          <ul className="list-disc ml-5 mt-2 dark:text-gray-200">
            <li className="dark:text-gray-300">Total Business: $0</li>
            <li className="dark:text-gray-300">Weekly Business: $0</li>
            <li className="dark:text-gray-300">Carry.Business: $0</li>
          </ul>
        </div>
        <div>
          <p className="font-semibold  dark:text-white">Sponsor:TARUN</p>
          <h1 className="font-bold text-xl  dark:text-white">Right Team</h1>
          <ul className="list-disc ml-5 mt-2 dark:text-gray-200">
            <li className="dark:text-gray-300">Total Business: $0</li>
            <li className="dark:text-gray-300">Weekly Business: $0</li>
            <li className="dark:text-gray-300">Carry.Business: $0</li>
          </ul>
        </div>
      </div> */}
      <Link
        to={{
          pathname: "/home",
          search: `?network=member-tree&uid=${user.uid}`,
        }}
        className="px-8 py-2 rounded-full bg-gradient-to-b from-blue-500 to-blue-600 text-white focus:ring-2 focus:ring-blue-400 hover:shadow-xl transition duration-200"
      >
        My Tree
      </Link>

      <Tree
        lineWidth={"2px"}
        lineColor={"green"}
        lineBorderRadius={"10px"}
        label={
          <div
            style={styles.node}
            className="mb-6 border-black  dark:border-white  border-dotted  border-2"
          >
            <img alt="ball" src={ball} className="w-6 h-6" loading="lazy" />
            <div
              style={styles.text}
              className="w-80 dark:text-gray-200 !rotate-[90deg]  !-left-2 !text-left"
            >
              {familyData.name}
            </div>
          </div>
        }
      >
        {familyData.children.map((child) => renderTreeNode(child))}
      </Tree>
    </div>
  );
}
