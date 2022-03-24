import { API_URL } from "../service/Constants";

export default class Blog {
    constructor(blogObj = null) {
        if (blogObj && blogObj instanceof Object) {
            this.id = blogObj.blogID;
            this.userID = blogObj.userID;
            this.markdown = blogObj.markdown;
            this.title = blogObj.title;
            this.rating = blogObj.rating;
            this.ratingCount = blogObj.ratingCount;
            this.creationDate = new Date(blogObj.creationDate);

            if (blogObj.editDate) this.editDate = new Date(blogObj.editDate);
            else this.editDate = null;

            if (blogObj.tags && blogObj.tags instanceof Array)
                this.tags = blogObj.tags;
            else this.tags = [];
        } else {
            this.id = -1;
            this.userID = -1;
            this.markdown = "";
            this.title = "";
            this.rating = null;
            this.ratingCount = 0;
            this.creationDate = null;
        }
    }

    /**
     * Saves the blog.
     * @param {string} token
     * @param {callbackFn} errHandle Handles the error. Should expect a string.
     * @returns Boolean indicating add status
     */
    async saveBlog(token, errHandle) {
        if (this.id === -1) {
            try {
                let res = await fetch(`${API_URL}/blog`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        'Authorization': "Bearer " + token,
                    },
                    body: JSON.stringify({
                        userID: this.userID,
                        markdown: this.markdown,
                        title: this.title,
                        tags: this.tags,
                    }),
                });

                if (res.ok) {
                    this.id = (await res.json()).newID;
                    return true;
                } else {
                    errHandle((await res.json()).error);
                    return false;
                }
            } catch (err) {
                errHandle(err.message);
                return false;
            }
        } else {
            let msg =
                "Attempt to save failed. This blog is already in the system.";
            console.error(msg);
            errHandle(msg);
            return false;
        }
    }


    /**
     * Deletes a blog
     * @param {string} token 
     * @param {number} userID 
     * @param {number} blogID 
     * @param {callbackFn} errHandle Should take a stirng as an argument.
     */
    static async deleteBlog(token, userID, blogID, errHandle) {
        if (this.id !== -1) {
            try {
                let res = await fetch(`${API_URL}/blog`, {
                    method: "DELETE",
                    headers: {
                        "Content-Type": "application/json",
                        'Authorization': "Bearer " + token,
                    },
                    body: JSON.stringify({
                        userID: userID,
                        blogID: blogID
                    }),
                });

                if (res.ok) {
                    return true;
                } else {
                    errHandle((await res.json()).error);
                    return false;
                }
            } catch (err) {
                errHandle(err.message);
                return false;
            }
        }
    }


    /**
     * Updates the blog using the data in the current object.
     * @param {string} token 
     * @param {callbackFn} errHandle 
     * @returns 
     */
    async updateBlog(token, errHandle) {
        if (this.id !== -1) {
            try {
                let res = await fetch(`${API_URL}/blog/${this.id}`, {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        'Authorization': "Bearer " + token,
                    },
                    body: JSON.stringify({
                        userID: userID,
                        blogID: blogID,
                        markdown: this.markdown,
                        title: this.title
                    }),
                });

                if (res.ok) {
                    return true;
                } else {
                    errHandle((await res.json()).error);
                }
            } catch (err) {
                errHandle(err.message);
            }
        }

        return false;
    }


    /**
     * 
     * @param {number} rating 
     * @param {string} token 
     * @param {number} userID 
     * @param {callbackFn} errHandle 
     * @returns 
     */
    async addUpdateRating(rating, token, userID, errHandle) {
        if (this.id !== -1) {
            try {
                let res = await fetch(`${API_URL}/blog/rating`, {
                    method: 'POST',
                    headers: {
                        "Content-Type": "application/json",
                        'Authorization': "Bearer " + token,
                    },
                    body: JSON.stringify({
                        userID: userID,
                        blogID: this.id,
                        rating: rating
                    })
                });

                //console.log(await res.text());

                if (res.ok) {
                    return true;
                } else {
                    errHandle((await res.json()).error);
                }

            } catch (err) {
                console.log(err);
                errHandle(err.message);
            }
        }
    }


    /**
     * Creates a blog at the current time.
     * @param {number} userID
     * @param {string} markdown
     * @param {string} title
     * @returns {Blog} A created blog object.
     */
    static createBlog(userID, markdown, title) {
        let blog = new Blog();
        blog.userID = userID;
        blog.markdown = markdown;
        blog.title = title;

        return blog;
    }


    /**
     * Retrives the blog.
     * @param {number} blogID 
     * @returns {Blog} A Blog object matching the given id.
     */
    static async getBlog(blogID) {
        try {
            let blog = await fetch(`${API_URL}/blog/${blogID}`);
            if (blog.ok) {
                return new Blog(await blog.json());
            } else {
                console.log((await blog.json()).error);
                return null;
            }
        } catch(err) {
            console.log(err.message);
            return null;
        }
    }
}
