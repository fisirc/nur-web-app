const std = @import("std");
const toml = @import("toml");
const git = @import("lib/git2/entry.zig");

const zzz = @import("zzz");

const http = zzz.HTTP;
const tardy = zzz.tardy;

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

fn base_handler(ctx: *const http.Context, _: void) !http.Respond {
    return ctx.response.apply(.{
        .status = .OK,
        .mime = http.Mime.HTML,
        .body = "Hello, world!",
    });
}

pub fn main() !void {
    const host: []const u8 = "0.0.0.0";
    const port: u16 = 9862;

    var gpa = std.heap.GeneralPurposeAllocator(.{ .thread_safe = true }){};
    const allocator = gpa.allocator();
    defer _ = gpa.deinit();

    var t = try tardy.Tardy(.auto).init(allocator, .{ .threading = .auto });
    defer t.deinit();

    var router = try http.Router.init(allocator, &.{
        http.Route.init("/").get({}, base_handler).layer(),
    }, .{});
    defer router.deinit(allocator);

    var socket = try tardy.Socket.init(.{ .tcp = .{ .host = host, .port = port } });
    defer socket.close_blocking();

    try socket.bind();
    try socket.listen(4096);

    const EntryParams = struct {
        router: *const http.Router,
        socket: tardy.Socket,
    };

    try t.entry(
        EntryParams{ .router = &router, .socket = socket },
        struct {
            fn entry(rt: *tardy.Runtime, p: EntryParams) !void {
                var server = http.Server.init(.{
                    .stack_size = 1024 * 1024 * 4,
                    .socket_buffer_bytes = 1024 * 2,
                    .keepalive_count_max = null,
                    .connection_count_max = 1024,
                });
                try server.serve(rt, p.router, .{ .normal = p.socket });
            }
        }.entry,
    );

    //git.init();
    //defer git.deinit();
//
    //var arena = std.heap.ArenaAllocator.init(std.heap.page_allocator);
    //var parser = toml.Parser(Recipe).init(arena.allocator());
    //defer parser.deinit();
//
    //const parsed = try parser.parseFile("example/example_recipe.toml");
//
    //std.debug.print("{s}::{s}\n", .{
    //    parsed.value.setup.url,
    //    parsed.value.setup.branch,
    //});
//
    //std.debug.print("cloning...", .{});
    //try git.cloneRepository("https://github.com/fisirc/nur", "hola");
    //std.debug.print("\rdone!       ", .{});
}

