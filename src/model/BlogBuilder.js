import Blog from './Blog';

/**
 * Builds a blog object. Can add or remove markdown sections from the blog.
 * Accepted block types are regular, h1, h2, h3. Other supported sections 
 * are the quote and image. 
 */
export default class BlogBuilder {
    constructor() {
        this.markdownComponentList = [];
        this.tags = new Set();
        this.title = '';
    }

    setTitle(text) {
        this.title = text;
    }

    escapeText(text) {
        console.log("Cleaning " + text);
        //Replace backslash first
        text = text.replace(/\\/i, "\\\\");

        //Bracket escape
        text = text.replace(/\(/ig, "\(");
        text = text.replace(/\)/ig, "\)");
        text = text.replace(/\[/ig, "\[");
        text = text.replace(/\]/ig, "\]");
        text = text.replace(/\{/ig, "\{");
        text = text.replace(/\}/ig, "\}");
        text = text.replace(/</ig, "\<");
        text = text.replace(/>/ig, "\>");

        text = text.replace(/#/ig, "\#");
        text = text.replace(/`/ig, "\`");
        text = text.replace(/\+/ig, "\+");
        text = text.replace(/-/ig, "\-");
        text = text.replace(/\./ig, "\.");
        text = text.replace(/!/ig, "\!");
        text = text.replace(/\|/ig, "\|");

        return text;
    }

    /**
     * 
     * @param {string} text 
     * @param {string} type 
     */
    addBlockSection(text, type = null, idx = null) {
        let blockType = type.toLowerCase() ?? "regular";

        if (blockType !== "regular" && blockType !== "h1" && blockType !== "h2" && blockType !== "h3")
            blockType = "regular";

        let newSection = { type: blockType, text: this.escapeText(text), raw: text };
        if (idx && idx > -1 && idx < this.markdownComponentList.length) {
            this.markdownComponentList.splice(idx, 0, newSection)
        } else {
            this.markdownComponentList.push(newSection);
        }
    }

    addImage(link, desc, idx = null) {
        let newSection = { type: 'image', link: link, description: desc };
        if (idx && idx > -1 && idx < this.markdownComponentList.length) {
            this.markdownComponentList.splice(idx, 0, newSection)
        } else {
            this.markdownComponentList.push(newSection);
        }
    }

    /**
     * Adds a block quote.
     * @param {string} text 
     * @param {number} idx 
     */
    addQuote(text, idx = null) {
        let raw = text;
        text = '> ' + text.replace(/(\n)/ig, '$1>');
        let newSection = { type: 'quote', text: text, raw: raw };
        if (idx && idx > -1 && idx < this.markdownComponentList.length) {
            this.markdownComponentList.splice(idx, 0, newSection)
        } else {
            this.markdownComponentList.push(newSection);
        }
    }

    removeSection(idx) {
        this.markdownComponentList.splice(idx, 1);
    }

    addTag(tagName) {
        this.tags.add(tagName);
    }

    removeTag(tagName) {
        this.tags.delete(tagName);
    }

    getTagList() {
        let tagArr = [];

        for (let tag of this.tags.values())
            tagArr.push(tag);

        return tagArr;
    }

    /**
     * Returns a blog object. The user id will not be set.
     */
    buildBlog() {
        let blog = new Blog();
        blog.title = this.title;

        this.markdownComponentList.forEach(ele => {
            if (ele.type === "regular") {
                blog.markdown += ele.text + '\n\n';
            } else if (ele.type === "h1") {
                blog.markdown += '# ' + ele.text + '\n\n';
            } else if (ele.type === "h2") {
                blog.markdown += '## ' + ele.text + '\n\n';
            } else if (ele.type === "h3") {
                blog.markdown += '### ' + ele.text + '\n\n';
            } else if (ele.type === "image") {
                blog.markdown += `![${ele.desc}](${ele.link})'\n`;
            } else if (ele.type === "quote") {
                blog.markdown += ele.text + '\n\n';
            }
        });


        let tagArr = [];

        for (let tag of this.tags.values())
            tagArr.push(tag);

        blog.tags = tagArr;

        return blog;
    }
}