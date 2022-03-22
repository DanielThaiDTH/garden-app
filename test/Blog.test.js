import axios from "axios";
import Blog from "../src/model/Blog";
import { DEV_API_URL } from "../src/service/Constants";
const testBlogID = 52;

test('Blog constructor makes valid Blog', async () => {
    let res = await axios.get(`${DEV_API_URL}/blog/${testBlogID}`);
    let blog = new Blog(res.data);
    expect(typeof blog.markdown === 'string').toBeTruthy();
    expect(typeof blog.title === 'string').toBeTruthy();
    expect(typeof blog.userID === 'number').toBeTruthy();
    expect(blog.tags instanceof Array).toBeTruthy();
    expect(blog.id).toEqual(testBlogID);
});