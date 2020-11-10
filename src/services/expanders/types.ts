// symbol for providers injection
const EXPANDERS_TYPES = {
    IDepartmentExpander: Symbol.for("IDepartmentExpander"),
    IManagerExpander: Symbol.for("IManagerExpander"),
    IOfficeExpander: Symbol.for("IOfficeExpander"),
    ISuperdepartmentExpander: Symbol.for("ISuperdepartmentExpander"),
    IExpander: Symbol.for("IExpander"),
    IExpanderFactory: Symbol.for("IExpanderFactory")
};

export { EXPANDERS_TYPES };