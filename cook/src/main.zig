const std = @import("std");
const toml = @import("toml");

const Recipe = struct {
    const Setup = struct {
        url: []const u8,
        branch: []const u8,
    };

    const Build = struct {
        steps: [][]const u8,
    };

    setup: *Setup,
    build: *Build,
};

pub fn main() !void {
    var arena = std.heap.ArenaAllocator.init(std.heap.page_allocator);
    var parser = toml.Parser(Recipe).init(arena.allocator());
    defer parser.deinit();

    const parsed = try parser.parseFile("example/example_recipe.toml");

    std.debug.print("{s}::{s}\n", .{
        parsed.value.setup.url,
        parsed.value.setup.branch,
    });
}
