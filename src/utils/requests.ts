import { Group } from "../models/Group";
import { Reason, Request, Status } from "../models/Request";
import { Role } from "../models/Role";
import { UserProfile } from "../models/User";
import authApi from "./authApi";
import mainApi from "./mainApi";
import { getTokenData, saveTokenData } from "./storage";

const AUTH_BACKEND_URL = import.meta.env.VITE_AUTH_BACKEND_URL;
const MAIN_BACKEND_URL = import.meta.env.VITE_MAIN_BACKEND_URL;

export const register = async (data: {
  login: string;
  name: string;
  password: string;
  role: Role;
}): Promise<void> => {
  if (!AUTH_BACKEND_URL) {
    throw new Error("AUTH_BACKEND_URL is not defined");
  }

  return authApi
    .post("/auth/register", data)
    .then((response: { data: { token: string; expire: string } }) => {
      saveTokenData({
        token: response.data.token,
        expiresIn: response.data.expire,
      });
    })
    .catch((error) => {
      return Promise.reject(error);
    });
};

export const login = async (data: {
  login: string;
  password: string;
}): Promise<void> => {
  if (!AUTH_BACKEND_URL) {
    throw new Error("AUTH_BACKEND_URL is not defined");
  }

  return authApi
    .post("/auth/login", data)
    .then((response: { data: { token: string; expire: string } }) => {
      saveTokenData({
        token: response.data.token,
        expiresIn: response.data.expire,
      });
    })
    .catch((error) => {
      return Promise.reject(error);
    });
};

export const getCurrentUserProfile = async (): Promise<UserProfile> => {
  if (!MAIN_BACKEND_URL) {
    throw new Error("MAIN_BACKEND_URL is not defined");
  }

  const tokenData = getTokenData();
  if (!tokenData) {
    throw new Error("No token found");
  }

  return mainApi
    .get("/users/me", {
      headers: {
        Authorization: `Bearer ${tokenData.token}`,
      },
    })
    .then(
      (response: {
        data: { id: string; name: string; login: string; role: string };
      }) => {
        return { ...response.data, role: response.data.role as Role };
      }
    )
    .catch((error) => {
      return Promise.reject(error);
    });
};

export const createRequest = async (data: {
  dateStart: Date;
  dateEnd: Date;
  status: Status;
  reason: Reason;
  userId: string;
  comment: string;
  fileInDean: boolean;
  fileUrl: string[];
}): Promise<Request> => {
  if (!MAIN_BACKEND_URL) {
    throw new Error("MAIN_BACKEND_URL is not defined");
  }

  const tokenData = getTokenData();
  if (!tokenData) {
    throw new Error("No token found");
  }

  return mainApi
    .post("/requests", data, {
      headers: {
        Authorization: `Bearer ${tokenData.token}`,
      },
    })
    .then(
      (response: {
        data: {
          id: string;
          creator: {
            id: string;
            name: string;
            login: string;
            role: string;
          };
          moderator: {
            id: string;
            name: string;
            login: string;
            role: string;
          } | null;
          dateStart: string;
          dateEnd: string;
          createdAt: string;
          reason: Reason;
          status: Status;
          comment: string;
          fileInDean: boolean;
          files: { id: string }[];
          groupNumber: number | null;
        };
      }) => {
        const request = response.data;
        return {
          ...request,
          creator: {
            ...request.creator,
            role: request.creator.role as Role,
          },
          moderator: request.moderator
            ? {
                ...request.moderator,
                role: request.moderator.role as Role,
              }
            : null,
          createdAt: new Date(request.createdAt),
          dateStart: new Date(request.dateStart),
          dateEnd: new Date(request.dateEnd),
        };
      }
    )
    .catch((error) => {
      return Promise.reject(error);
    });
};

export const getRequests = async (queryParams: {
  dataStart?: Date;
  dataEnd?: Date;
  name?: string;
  status?: Status;
  reason?: Reason;
  groupNumber?: number;
}): Promise<Request[]> => {
  if (!MAIN_BACKEND_URL) {
    throw new Error("MAIN_BACKEND_URL is not defined");
  }

  const tokenData = getTokenData();
  if (!tokenData) {
    throw new Error("No token found");
  }

  return mainApi
    .get("/requests", {
      headers: {
        Authorization: `Bearer ${tokenData.token}`,
      },
      params: queryParams,
    })
    .then(
      (response: {
        data: {
          id: string;
          creator: {
            id: string;
            name: string;
            login: string;
            role: string;
          };
          moderator: {
            id: string;
            name: string;
            login: string;
            role: string;
          } | null;
          dateStart: string;
          dateEnd: string;
          createdAt: string;
          reason: Reason;
          status: Status;
          comment: string;
          fileInDean: boolean;
          files: { id: string }[];
          groupNumber: number | null;
        }[];
      }) => {
        return response?.data?.map((request) => {
          return {
            ...request,
            creator: {
              ...request.creator,
              role: request.creator.role as Role,
            },
            moderator: request.moderator
              ? {
                  ...request.moderator,
                  role: request.moderator.role as Role,
                }
              : null,
            createdAt: new Date(request.createdAt),
            dateStart: new Date(request.dateStart),
            dateEnd: new Date(request.dateEnd),
          };
        });
      }
    )
    .catch((error) => {
      return Promise.reject(error);
    });
};

export const editRequest = async (
  requestId: string,
  data: {
    creatorId: string;
    dateStart: Date;
    dateEnd: Date;
    comment: string;
    status: Status;
    reason: Reason;
    fileInDean: boolean;
  }
) => {
  if (!MAIN_BACKEND_URL) {
    throw new Error("MAIN_BACKEND_URL is not defined");
  }

  const tokenData = getTokenData();
  if (!tokenData) {
    throw new Error("No token found");
  }

  return mainApi.put(`/requests/${requestId}`, data, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${tokenData.token}`,
    },
  });
};

export const exportRequests = async (queryParams: {
  dataStart?: Date;
  dataEnd?: Date;
  name?: string;
  status?: Status;
  reason?: Reason;
  groupNumber?: number;
}): Promise<Blob> => {
  if (!MAIN_BACKEND_URL) {
    throw new Error("MAIN_BACKEND_URL is not defined");
  }

  const tokenData = getTokenData();
  if (!tokenData) {
    throw new Error("No token found");
  }

  return mainApi
    .get("/requests/export", {
      headers: {
        Authorization: `Bearer ${tokenData.token}`,
      },
      params: queryParams,
      responseType: "blob", // To handle binary data (zip file)
    })
    .then((response: { data: Blob }) => {
      return response.data;
    })
    .catch((error) => {
      return Promise.reject(error);
    });
};

export const getUserRequests = async (
  userId: string,
  queryParams: {
    dataStart?: Date;
    dataEnd?: Date;
    status?: Status;
  }
): Promise<Request[]> => {
  if (!MAIN_BACKEND_URL) {
    throw new Error("MAIN_BACKEND_URL is not defined");
  }

  const tokenData = getTokenData();
  if (!tokenData) {
    throw new Error("No token found");
  }

  return mainApi
    .get(`/requests/users/${userId}`, {
      headers: {
        Authorization: `Bearer ${tokenData.token}`,
      },
      params: queryParams,
    })
    .then(
      (response: {
        data: {
          id: string;
          creator: {
            id: string;
            name: string;
            login: string;
            role: string;
          };
          moderator: {
            id: string;
            name: string;
            login: string;
            role: string;
          } | null;
          dateStart: string;
          dateEnd: string;
          createdAt: string;
          reason: Reason;
          status: Status;
          comment: string;
          fileInDean: boolean;
          files: { id: string }[];
          groupNumber: number | null;
        }[];
      }) => {
        return response?.data?.map((request) => {
          return {
            ...request,
            creator: {
              ...request.creator,
              role: request.creator.role as Role,
            },
            moderator: request.moderator
              ? {
                  ...request.moderator,
                  role: request.moderator.role as Role,
                }
              : null,
            createdAt: new Date(request.createdAt),
            dateStart: new Date(request.dateStart),
            dateEnd: new Date(request.dateEnd),
          };
        });
      }
    )
    .catch((error) => {
      return Promise.reject(error);
    });
};

export const exportUserRequests = async (
  userId: string,
  queryParams: {
    dataStart?: Date;
    dataEnd?: Date;
  }
): Promise<Blob> => {
  if (!MAIN_BACKEND_URL) {
    throw new Error("MAIN_BACKEND_URL is not defined");
  }

  const tokenData = getTokenData();
  if (!tokenData) {
    throw new Error("No token found");
  }

  return mainApi
    .get(`/requests/${userId}/export`, {
      headers: {
        Authorization: `Bearer ${tokenData.token}`,
      },
      params: queryParams,
      responseType: "blob", // To handle binary data (zip file)
    })
    .then((response: { data: Blob }) => {
      return response.data;
    })
    .catch((error) => {
      return Promise.reject(error);
    });
};

export const getGroups = async (): Promise<Group[]> => {
  if (!MAIN_BACKEND_URL) {
    throw new Error("MAIN_BACKEND_URL is not defined");
  }

  const tokenData = getTokenData();
  if (!tokenData) {
    throw new Error("No token found");
  }

  return mainApi
    .get("/groups", {
      headers: {
        Authorization: `Bearer ${tokenData.token}`,
      },
    })
    .then(
      (response: {
        data: {
          id: string;
          number: number;
          students: {
            id: string;
            name: string;
            login: string;
            role: string;
          }[];
        }[];
      }) => {
        return (
          response?.data?.map((group) => {
            return {
              id: group.id,
              number: group.number,
              students: group.students.map((student) => ({
                id: student.id,
                name: student.name,
                login: student.login,
                role: student.role as Role,
              })),
            };
          }) || []
        );
      }
    )
    .catch((error) => {
      return Promise.reject(error);
    });
};

export const createGroup = async (data: {
  number: number;
  students: string[];
}) => {
  if (!MAIN_BACKEND_URL) {
    throw new Error("MAIN_BACKEND_URL is not defined");
  }

  const tokenData = getTokenData();
  if (!tokenData) {
    throw new Error("No token found");
  }

  return mainApi.post("/groups", data, {
    headers: {
      Authorization: `Bearer ${tokenData.token}`,
    },
  });
};

export const uploadDocuments = async (requestId: string, files: File[]) => {
  if (!MAIN_BACKEND_URL) {
    throw new Error("MAIN_BACKEND_URL is not defined");
  }

  const tokenData = getTokenData();
  if (!tokenData) {
    throw new Error("No token found");
  }

  const formData = new FormData();
  files.forEach((file) => {
    formData.append("file", file);
  });

  return mainApi.post(`/requests/upload/${requestId}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${tokenData.token}`,
    },
  });
};

export const getUsers = async (queryParams: {
  name?: string;
  groupNumber?: number;
  role?: Role;
}) => {
  if (!MAIN_BACKEND_URL) {
    throw new Error("MAIN_BACKEND_URL is not defined");
  }

  const tokenData = getTokenData();
  if (!tokenData) {
    throw new Error("No token found");
  }

  return mainApi.get("/users", {
    headers: {
      Authorization: `Bearer ${tokenData.token}`,
    },
    params: queryParams,
  });
};

export const updateUserRole = async (userId: string, role: Role) => {
  if (!MAIN_BACKEND_URL) {
    throw new Error("MAIN_BACKEND_URL is not defined");
  }

  const tokenData = getTokenData();
  if (!tokenData) {
    throw new Error("No token found");
  }

  return mainApi.patch(
    `/users/${userId}`,
    { role },
    {
      headers: {
        Authorization: `Bearer ${tokenData.token}`,
      },
    }
  );
};
